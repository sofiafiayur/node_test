
import { noParamsAppGet, ParamsAppGet, ReqParams, node_tree_nameQuery, node_treeQuery, Node_treeModel, nodeChildrenNum } from './index';

describe('mysqlQuery', () => {
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
