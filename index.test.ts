
import { noParamsAppGet, ParamsAppGet, ReqParams, node_tree_nameQuery, node_treeQuery, NodeTreeModel, nodeChildrenNum } from './index';
import {Response} from 'express';
import { request } from 'http';

const reqParams: ReqParams = {
    node_id: 5,
    language: 'english',
    search: 'oce',
    page_num: 0,
    page_size: 1,
}

const treeRow: NodeTreeModel = {
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

// describe('test get /:node_id/:language', () => {
//     it ('should return NodeInfo', async () => {
//         const res = await request(ParamsAppGet).get('/' + reqParams.node_id + reqParams.language);
//         expect
//     });
//     });
// })
