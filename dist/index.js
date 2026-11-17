"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamsAppGet = exports.noParamsAppGet = void 0;
exports.node_tree_nameQuery = node_tree_nameQuery;
exports.node_treeQuery = node_treeQuery;
exports.nodeChildrenNum = nodeChildrenNum;
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const env_json_1 = __importDefault(require("./env.json"));
const connection = mysql_1.default.createConnection({
    host: env_json_1.default.host,
    port: env_json_1.default.port,
    user: env_json_1.default.user,
    password: env_json_1.default.password,
    database: env_json_1.default.database,
});
connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('connected');
    }
});
const invalMessage = 'Invalid node id';
const errMessage = 'There is an error!';
const missingMandtory = 'Missing mandatory params';
/**
 *  Create a new Express Class
 */
const app = (0, express_1.default)();
/**
 * define the url without node_id or language as params inputs
 * return missingMandoty
 */
exports.noParamsAppGet = app.get('/:node_id?', (req, res, next) => {
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
exports.ParamsAppGet = app.get('/:node_id/:language', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let reqParams = {
        node_id: Number(req.params.node_id),
        language: req.params.language,
        page_num: Number(req.query.page_num || 0),
        page_size: Number(req.query.page_size || 100),
        search: typeof req.query.search === 'string' ? req.query.search : undefined,
    };
    if (reqParams.page_num > 0) {
        res.send('Invalid page number requested');
        return;
    }
    if (reqParams.page_size < 0 || reqParams.page_size > 1000) {
        res.send('Invalid page size requested');
        return;
    }
    if (reqParams.language !== 'italian' && reqParams.language !== 'english') {
        res.send(missingMandtory);
        return;
    }
    if (!reqParams.node_id) {
        res.send(invalMessage);
        return;
    }
    try {
        const treeRows = yield node_treeQuery(reqParams);
        if (!Array.isArray(treeRows) || treeRows.length === 0) {
            res.send(invalMessage);
            return;
        }
        const childCount = yield nodeChildrenNum(treeRows[0]);
        const nameRows = yield node_tree_nameQuery(reqParams);
        if (!Array.isArray(nameRows) || nameRows.length === 0) {
            res.send(invalMessage);
            return;
        }
        const resRow = {
            node_id: nameRows[0].idNode,
            name: nameRows[0].nodeName,
            children_count: typeof childCount === 'number' ? childCount : 0,
        };
        res.send(resRow);
    }
    catch (_a) {
        res.status(503).send('Database unavailable. Check that MySQL is running and env.json is correct.');
    }
}));
/**
 * Get rows from table 'node_tree_names'
 * @function node_tree_nameQuery
 * @param reqParams
 * @returns Promise<Node_tree_namesModel[]>
 */
function node_tree_nameQuery(reqParams) {
    let page_start = reqParams.page_num * reqParams.page_size;
    let limit = page_start + ', ' + reqParams.page_size;
    if (reqParams && reqParams.search && reqParams.search.length > 0) {
        return new Promise((resolve, rejects) => {
            connection.query('SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? AND nodeName LIKE ? LIMIT ' + limit, [reqParams.node_id, reqParams.language, reqParams.search], (err, rows) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    rejects(errMessage);
                }
                else {
                    if (rows && rows.length > 0) {
                        resolve(rows);
                    }
                    else {
                        resolve(invalMessage);
                    }
                }
            }));
        });
    }
    else {
        return new Promise((resolve, rejects) => {
            connection.query('SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? LIMIT ' + limit, [reqParams.node_id, reqParams.language, reqParams.search], (err, rows) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    rejects(errMessage);
                }
                else {
                    if (rows && rows.length > 0) {
                        resolve(rows);
                    }
                    else {
                        resolve(invalMessage);
                    }
                }
            }));
        });
    }
}
/**
 * Get the row from table 'node_tree' with idNode inserted
 * @function node_treeQuery
 * @param reqParams: ReqParams
 * @returns Promise<Node_treeModel[]>
 */
function node_treeQuery(reqParams) {
    return new Promise((resolve, rejects) => {
        connection.query('SELECT * FROM node_tree WHERE idNode = ? ', reqParams.node_id, (err, rows) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                rejects(errMessage);
            }
            else {
                if (rows && rows.length > 0) {
                    resolve(rows);
                }
                else {
                    resolve(invalMessage);
                }
            }
        }));
    });
}
/**
 * Count the total children of the node requested.
 * @function nodeChildrenNum
 * @param treeRows
 * @returns Promise<number>
 */
function nodeChildrenNum(treeRows) {
    return new Promise((resolve, rejects) => {
        connection.query('SELECT * FROM node_tree WHERE iLeft > ? AND iRight < ?', [treeRows.iLeft, treeRows.iRight], (err, rows) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                rejects(errMessage);
            }
            else {
                if (rows && rows.length > 0) {
                    resolve(rows.length);
                }
                else {
                    resolve(invalMessage);
                }
            }
        }));
    });
}
/**
 * open local port 3000...
 */
app.listen(3000, () => console.log('Example app listening on port 3000...'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFzSUEsa0RBcUNDO0FBUUQsd0NBZUM7QUFRRCwwQ0FlQztBQXpORCxzREFBOEI7QUFDOUIsa0RBQTBCO0FBQzFCLDBEQUE2QjtBQWlDN0IsTUFBTSxVQUFVLEdBQUcsZUFBSyxDQUFDLGdCQUFnQixDQUFDO0lBQ3RDLElBQUksRUFBRSxrQkFBRyxDQUFDLElBQUk7SUFDZCxJQUFJLEVBQUUsa0JBQUcsQ0FBQyxJQUFJO0lBQ2QsSUFBSSxFQUFFLGtCQUFHLENBQUMsSUFBSTtJQUNkLFFBQVEsRUFBRSxrQkFBRyxDQUFDLFFBQVE7SUFDdEIsUUFBUSxFQUFFLGtCQUFHLENBQUMsUUFBUTtDQUN6QixDQUFDLENBQUM7QUFFSCxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVMsR0FBUTtJQUNoQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQixDQUFDO1NBQU0sQ0FBQztRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0IsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxZQUFZLEdBQVcsaUJBQWlCLENBQUM7QUFDL0MsTUFBTSxVQUFVLEdBQVcsb0JBQW9CLENBQUM7QUFDaEQsTUFBTSxlQUFlLEdBQVcsMEJBQTBCLENBQUM7QUFFM0Q7O0dBRUc7QUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUV0Qjs7O0dBR0c7QUFDVSxRQUFBLGNBQWMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDM0YsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMxQixJQUFJ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