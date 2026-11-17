"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const reqParams = {
    node_id: 5,
    language: 'english',
    search: 'oce',
    page_num: 0,
    page_size: 1,
};
const treeRow = {
    idNode: 5,
    level: 1,
    iLeft: 1,
    iRight: 24,
};
describe('mysqlQuery', () => {
    it('should return rows', () => {
        expect(() => {
            (0, index_1.node_tree_nameQuery)(reqParams)
                .then((rows) => {
                rows = [{ idNode: 5, language: 'english', nodeName: 'Docebo' }];
            });
        });
    });
    it('should return rows', () => {
        expect(() => {
            (0, index_1.node_treeQuery)(reqParams)
                .then((rows) => {
                rows = [{ idNode: 5, level: 1, iLeft: 1, iRight: 24 }];
            });
        });
    });
    it('should return rows', () => {
        expect(() => {
            (0, index_1.nodeChildrenNum)(treeRow)
                .then((rows) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2luZGV4LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxtQ0FBdUk7QUFJdkksTUFBTSxTQUFTLEdBQWM7SUFDekIsT0FBTyxFQUFFLENBQUM7SUFDVixRQUFRLEVBQUUsU0FBUztJQUNuQixNQUFNLEVBQUUsS0FBSztJQUNiLFFBQVEsRUFBRSxDQUFDO0lBQ1gsU0FBUyxFQUFFLENBQUM7Q0FDZixDQUFBO0FBRUQsTUFBTSxPQUFPLEdBQWtCO0lBQzNCLE1BQU0sRUFBRSxDQUFDO0lBQ1QsS0FBSyxFQUFFLENBQUM7SUFDUixLQUFLLEVBQUUsQ0FBQztJQUNSLE1BQU0sRUFBRSxFQUFFO0NBQ2IsQ0FBQTtBQUdELFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBRXhCLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDMUIsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNSLElBQUEsMkJBQW1CLEVBQUMsU0FBUyxDQUFDO2lCQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTtnQkFDaEIsSUFBSSxHQUFHLENBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFFLENBQUM7WUFDdEUsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1IsSUFBQSxzQkFBYyxFQUFDLFNBQVMsQ0FBQztpQkFDcEIsSUFBSSxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7Z0JBQ2hCLElBQUksR0FBRyxDQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFFLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1IsSUFBQSx1QkFBZSxFQUFDLE9BQU8sQ0FBQztpQkFDbkIsSUFBSSxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7Z0JBQ2hCLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsQ0FBQztBQUVILG1EQUFtRDtBQUNuRCxrREFBa0Q7QUFDbEQscUdBQXFHO0FBQ3JHLGlCQUFpQjtBQUNqQixVQUFVO0FBQ1YsVUFBVTtBQUNWLEtBQUsifQ==