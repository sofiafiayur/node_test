
import { noParamsAppGet, ParamsAppGet, ReqParams, node_tree_nameQuery, node_treeQuery, Node_treeModel, nodeChildrenNum, asyncMiddleware } from './index';
import {Response} from 'express';

const reqParams: ReqParams = {
    node_id: 5,
    language: 'english',
    search: 'oce',
    page_num: 0,
    page_size: 1,
}

const treeRow: Node_treeModel = {
    idNode: 5,
    level: 1,
    iLeft: 1,
    iRight: 24,
}


describe('mysqlQuery', () => {
    
    it('should return rows', () => {
        expect(() => {
            node_tree_nameQuery(reqParams)
                .then((rows: any) => {
                    rows = [ { idNode: 5, language: 'english', nodeName: 'Docebo' } ];
                });
        });
    });
    
    it('should return rows', () => {
        expect(() => {
            node_treeQuery(reqParams)
                .then((rows: any) => {
                    rows = [ { idNode: 5, level: 1, iLeft: 1, iRight: 24 } ];
                });
        });
    });
    
    it('should return rows', () => {
        expect(() => {
            nodeChildrenNum(treeRow)
                .then((rows: any) => {
                    rows = 11;
                });
        });
    });

});

describe('test get /:node_id/:language', () => {
    it ('should return NodeInfo', () => {
        const res = new Response();
        const next = jest.fn();
        ParamsAppGet(reqParams, res, next)
        expect(() => {res.send({
            node_id: 5,
            nodeName: 'Docebo',
            children_count: 11
        });
    });
    });
})
