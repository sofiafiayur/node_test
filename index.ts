import express from 'express';
import mysql from 'mysql';
import env from './env.json';
import {Response, Request } from 'express';

export type Languages = 'english' | 'italian';

export interface Node_tree_namesModel {
    idName: number,
    idNode: number,
    nodeName: string,
    language: Languages,
}

export interface Node_treeModel {
    idNode: number,
    level: number,
    iLeft: number,
    iRight: number,
}

export interface ReqParams {
    node_id: number,
    language: string,
    page_num: number,
    page_size: number,
    search?: string,
}

const connection = mysql.createConnection({
    host: env.host,
    port: env.port,
    user: env.user,
    password: env.password,
    database: env.database,
});

connection.connect(function(err: any) {
    if (err) {
        console.log(err);
    } else {
        console.log('connected');
    }
});

const invalMessage: String = 'Invalid node id';
const errMessage: string = 'There is an error!';
const missingMandtory: string = 'Missing mandatory params';

/**
 *  Create a new Express Class
 */
const app = express();

/**
 * define the url without node_id or language as params inputs
 * return missingMandoty
 */
export const noParamsAppGet = app.get('/:node_id?', (req: Request, res: Response, next: any) => {
    res.send(missingMandtory);
    next();
});

/**
 * define the url with both of node_id and language as params inputs
 * return resRow {
 *          node_id: number,
 *          nodeName: string,
 *          child_num: number,
 *        }
 */
export const ParamsAppGet = app.get('/:node_id/:language', (req: Request, res: Response, next: any) => {
    let reqParams : ReqParams = {
        node_id: req.params.node_id,
        language: req.params.language,
        page_num: req.query.page_num || 0,
        page_size: req.query.page_size || 100,
        search: req.query.search,
    }
    
    try {
        if (reqParams.page_num > 0) {
            res.send('Invalid page number requested');
            next();
        } else if (reqParams.page_size < 0 || reqParams.page_size > 1000) {
            res.send('Invalid page size requested');
            next();
        } else {
            if (reqParams.language && reqParams.node_id) {
                node_treeQuery(reqParams)
                    .then((treeRows: any) => {
                        if (treeRows && treeRows.length > 0) {
                            const node_treeRow = treeRows;
                            node_treeRow.forEach((row: Node_treeModel) => {
                                // count the children number of the node.
                                nodeChildrenNum(row)
                                    .then((child_num: any) => {
                                        if (child_num && child_num > 0) {
                                            node_tree_nameQuery(reqParams)
                                                .then((nameRows: any) => {
                                                    if (nameRows && nameRows.length > 0) {
                                                        let resRow = {
                                                            node_id: nameRows[0].idNode,
                                                            name: nameRows[0].nodeName,
                                                            children_count: child_num,
                                                        };
                                                        res.send(resRow);
                                                    } else {
                                                        res.send(invalMessage);
                                                    }
                                                })
                                            .catch((errs: any) => { throw new Error(errs); });
                                        }
                                    })
                                    .catch((err: any) => {throw new Error(errMessage)});
                            });
                        }
                    })
                    .catch((errs: any) => { throw new Error(errMessage); });
            } else {
                res.send(missingMandtory);
            }
        }
    } catch {
        res.status(500).send(errMessage);
    }
});

/**
 * Get rows from table 'node_tree_names'
 * @function node_tree_nameQuery
 * @param reqParams
 * @returns Promise<Node_tree_namesModel[]>
 */
export function node_tree_nameQuery (reqParams: ReqParams)  {
    let page_start = reqParams.page_num * reqParams.page_size;
    let limit = page_start + ', ' + reqParams.page_size;

    if (reqParams && reqParams.search && reqParams.search.length > 0) {            
        return new Promise ((resolve, rejects) => {
            connection.query('SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? AND nodeName LIKE ? LIMIT ' + limit,
                             [reqParams.node_id, reqParams.language, reqParams.search],
                             async (err: any, rows: Node_tree_namesModel[]) => {
                                if (err) {
                                    rejects(errMessage);
                                } else {
                                    if (rows && rows.length > 0) {
                                        resolve(rows);
                                    } else {
                                        resolve(invalMessage);
                                    }
                                }
                });
        });
    } else {
        return new Promise ((resolve, rejects) => {
            connection.query('SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? LIMIT ' + limit,
                             [reqParams.node_id, reqParams.language, reqParams.search],
                             async (err: any, rows: Node_tree_namesModel[]) => {
                                if (err) {
                                    rejects(errMessage);
                                } else {
                                    if (rows && rows.length > 0) {
                                        resolve(rows);
                                    } else {
                                        resolve(invalMessage);
                                    }
                                }
             });
        });
    }
}

/**
 * Get the row from table 'node_tree' with idNode inserted
 * @function node_treeQuery
 * @param reqParams: ReqParams
 * @returns Promise<Node_treeModel[]>
 */
export function node_treeQuery (reqParams: ReqParams) {
    return new Promise ((resolve, rejects) => {
        connection.query('SELECT * FROM node_tree WHERE idNode = ? ', reqParams.node_id,
            async (err: any, rows: Node_treeModel[]) => {
                if (err) {
                    rejects(errMessage);
                } else {
                    if (rows && rows.length > 0) {
                        resolve(rows);
                    } else {
                        resolve(invalMessage);
                    }
                }
            });
    });
}

/**
 * Count the total children of the node requested.
 * @function nodeChildrenNum
 * @param treeRows 
 * @returns Promise<number>
 */
export function nodeChildrenNum (treeRows: Node_treeModel) {
    return new Promise ((resolve, rejects) => {
        connection.query('SELECT * FROM node_tree WHERE iLeft > ? AND iRight < ?', [treeRows.iLeft, treeRows.iRight],
            async (err: any, rows: Node_treeModel[]) => {
                if (err) {
                    rejects(errMessage);
                } else {
                    if (rows && rows.length > 0) {
                        resolve(rows.length);
                    } else {
                        resolve(invalMessage);
                    }
                }
            });
    });
}

/**
 * open local port 3000...
 */
app.listen(3000, () => console.log('Example app listening on port 3000...'));
