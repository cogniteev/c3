import c3 from '../src';

const $$ = c3.chart.internal.fn;
$$.d3 = require("d3");

describe('data.convert', () => {

    describe('$$.convertColumnsToData', () => {
        it('converts column data to normalized data', () => {
            const data = $$.convertColumnsToData([
                ["cat1", "a", "b", "c", "d"],
                ["data1", 30, 200, 100, 400],
                ["cat2", "b", "a", "c", "d", "e", "f"],
                ["data2", 400, 60, 200, 800, 10, 10]
            ]);

            expect(data).toEqual({
                keys: [ 'cat1', 'data1', 'cat2', 'data2' ],
                rows: [{
                    cat1: 'a',
                    data1: 30,
                    cat2: 'b',
                    data2: 400
                }, {
                    cat1: 'b',
                    data1: 200,
                    cat2: 'a',
                    data2: 60
                }, {
                    cat1: 'c',
                    data1: 100,
                    cat2: 'c',
                    data2: 200
                }, {
                    cat1: 'd',
                    data1: 400,
                    cat2: 'd',
                    data2: 800
                }, {
                    cat2: 'e',
                    data2: 10
                }, {
                    cat2: 'f',
                    data2: 10
                }]
            });
        });

        it('throws when the column data contains undefined', () => {
            expect(() => $$.convertColumnsToData([
                ["cat1", "a", "b", "c", "d"],
                ["data1", undefined]
            ])).toThrowError(Error, /Source data is missing a component/);
        });
    });

    describe('$$.convertRowsToData', () => {
        it('converts the row data to normalized data', () => {
            const data = $$.convertRowsToData([
                ['data1', 'data2', 'data3'],
                [90, 120, 300],
                [40, 160, 240],
                [50, 200, 290],
                [120, 160, 230],
                [80, 130, 300],
                [90, 220, 320]
            ]);

            expect(data).toEqual({
                keys: ['data1', 'data2', 'data3'],
                rows: [{
                    data1: 90,
                    data2: 120,
                    data3: 300
                }, {
                    data1: 40,
                    data2: 160,
                    data3: 240
                }, {
                    data1: 50,
                    data2: 200,
                    data3: 290
                }, {
                    data1: 120,
                    data2: 160,
                    data3: 230
                }, {
                    data1: 80,
                    data2: 130,
                    data3: 300
                }, {
                    data1: 90,
                    data2: 220,
                    data3: 320
                }]
            });
        });

        it('throws when the row data contains undefined', () => {
            expect(() => $$.convertRowsToData([
                ['data1', 'data2', 'data3'],
                [40, 160, 240],
                [90, 120, undefined]
            ])).toThrowError(Error, /Source data is missing a component/);
        });
    });

    describe('$$.convertXsvToData', () => {
        it('converts the csv data to normalized data', () => {
            const data = [{
                    data1: '90',
                    data2: '120',
                    data3: '300'
                }, {
                    data1: '40',
                    data2: '160',
                    data3: '240'
                }, {
                    data1: '50',
                    data2: '200',
                    data3: '290'
                }, {
                    data1: '120',
                    data2: '160',
                    data3: '230'
                }, {
                    data1: '80',
                    data2: '130',
                    data3: '300'
                }, {
                    data1: '90',
                    data2: '220',
                    data3: '320'
                }];
            data.columns = ['data1', 'data2', 'data3'];
            expect($$.convertXsvToData(data)).toEqual({
                keys: ['data1', 'data2', 'data3'],
                rows: [{
                    data1: '90',
                    data2: '120',
                    data3: '300'
                }, {
                    data1: '40',
                    data2: '160',
                    data3: '240'
                }, {
                    data1: '50',
                    data2: '200',
                    data3: '290'
                }, {
                    data1: '120',
                    data2: '160',
                    data3: '230'
                }, {
                    data1: '80',
                    data2: '130',
                    data3: '300'
                }, {
                    data1: '90',
                    data2: '220',
                    data3: '320'
                }]
            });
        });

        it('converts one lined CSV data', () => {
            const data = [];
            data.columns = ['data1', 'data2', 'data3'];
            expect($$.convertXsvToData(data)).toEqual({
                keys: ['data1', 'data2', 'data3'],
                rows: [{
                    data1: null,
                    data2: null,
                    data3: null
                }]
            });
        });
    });

    describe('$$.convertDataToTargets', () => {

        beforeEach(() => {
            $$.cache = {};

            $$.data = {
                xs: []
            };

            $$.config = {
                data_idConverter: (v) => v
            };
        });

        it('converts the legacy data format into targets', () => {
            const targets = $$.convertDataToTargets([ {
                data1: 90,
                data2: 120,
                data3: 300
            }, {
                data1: 40,
                data2: 160,
                data3: 240
            } ]);

            expect(targets).toEqual([{
                id: 'data1',
                id_org: 'data1',
                values: [ { x: 0, value: 90, id: 'data1', index: 0 }, { x: 1, value: 40, id: 'data1', index: 1 } ]
            }, {
                id: 'data2',
                id_org: 'data2',
                values: [ { x: 0, value: 120, id: 'data2', index: 0 }, { x: 1, value: 160, id: 'data2', index: 1 } ]
            }, {
                id: 'data3',
                id_org: 'data3',
                values: [ { x: 0, value: 300, id: 'data3', index: 0 }, { x: 1, value: 240, id: 'data3', index: 1 } ]
            }]);
        });

        it('converts the data into targets', () => {
            const targets = $$.convertDataToTargets({
                keys: [ 'data1', 'data2', 'data3' ],
                rows: [ {
                    data1: 90,
                    data2: 120,
                    data3: 300
                }, {
                    data1: 40,
                    data2: 160,
                    data3: 240
                } ]
            });

            expect(targets).toEqual([{
                id: 'data1',
                id_org: 'data1',
                values: [ { x: 0, value: 90, id: 'data1', index: 0 }, { x: 1, value: 40, id: 'data1', index: 1 } ]
            }, {
                id: 'data2',
                id_org: 'data2',
                values: [ { x: 0, value: 120, id: 'data2', index: 0 }, { x: 1, value: 160, id: 'data2', index: 1 } ]
            }, {
                id: 'data3',
                id_org: 'data3',
                values: [ { x: 0, value: 300, id: 'data3', index: 0 }, { x: 1, value: 240, id: 'data3', index: 1 } ]
            }]);
        });

        it('handles falsy values with custom X category', () => {
            const targets = $$.convertDataToTargets({
                xs: {
                    "Series": 'Series_x'
                },
                columns: [
                    ["Series_x", 1, 5, 10, 15],
                    ["Series", 4.0, null, 5.0, 6.0],
                ],
                type: 'scatter'
            });

            console.log(targets);
        });

        it('handles falsy values with multiple custom X values', () => {
            const targets = $$.convertDataToTargets({
                'keys': [ 'd1', 'd1_x', 'd2', 'd2_x', 'd1Avg', 'd1Avg_x', 'd2Avg', 'd2Avg_x' ],
                'rows': [
                    { 'd1': null, 'd1_x': 0, 'd2': null, 'd2_x': undefined, 'd1Avg': null, 'd1Avg_x': '', 'd2Avg': null, 'd2Avg_x': null },
                    { 'd1': -2.46, 'd1_x': -6.24, 'd2': null, 'd2_x': null, 'd1Avg': null, 'd1Avg_x': null, 'd2Avg': null, 'd2Avg_x': null },
                    { 'd1': 4.09, 'd1_x': -0.29, 'd2': 4.84, 'd2_x': -4.19, 'd1Avg': null, 'd1Avg_x': null, 'd2Avg': null, 'd2Avg_x': null },
                    { 'd1': -2.97, 'd1_x': -5.98, 'd2': 1.97, 'd2_x': -1.74, 'd1Avg': null, 'd1Avg_x': null, 'd2Avg': null, 'd2Avg_x': null },
                    { 'd1': -0.46, 'd1_x': -7.15, 'd2': -0.45, 'd2_x': -0.01, 'd1Avg': -0.45, 'd1Avg_x': -4.71, 'd2Avg': 1.19, 'd2Avg_x': -2.64 }
                ]
            });

            console.log(targets);

        });

        it('handles falsy values with category X axis', () => {
            // TODO
            /*
            var chart = c3.generate({
    data: {
        json: [
            {name: 'data1',value: 200},
            {value: 100},
            {name: 'data3', value: 300},
            {name: 'data4', value: 400},
        ],

    keys: {
            x: 'name',
            value: ['value'],
        },
        type: 'bar'
    },
    axis: {
        x: {
            type: 'category'
        }
    }
});
             */
        });

        it('handles missing values with timseries X axis', () => {
            // TODO
            /*
            {
    "xs": {
      "o1": "o1 dates",
      "o2": "o2 dates",
      "o3": "o3 dates",
      "o7": "o7 dates"
    },
    "xFormat": "%d/%m/%Y",
    "columns": [
  [
    "o1 dates",
    "01/01/2019",
    "02/01/2019",
    "03/01/2019",
    "04/01/2019",
    "05/01/2019",
    "06/01/2019"
  ],
  [
    "o1",
    "17",
    "16",
    "16",
    "12",
    "16",
    "16"
  ],
  [
    "o2 dates",
    "01/01/2019",
    "02/01/2019",
    "03/01/2019",
    "04/01/2019",
    "05/01/2019",
    "06/01/2019"
  ],
  [
    "o2",
    "20",
    "27",
    "30",
    "34",
    "24",
    "27"
  ],
  [
    "o3 dates",
    "01/01/2019",
    "02/01/2019",
    "03/01/2019",
    "04/01/2019",
    "05/01/2019",
    "06/01/2019"
  ],
  [
    "o3",
    "14",
    "19",
    "22",
    "13",
    "19",
    "18"
  ],
  [
    "o7 dates",
    "01/01/2019",
    "02/01/2019",
    "03/01/2019",
    "04/01/2019",
    "06/01/2019"
  ],
  [
    "o7",
    "4",
    "6",
    "4",
    "5",
    "5"
  ]
],
    "types": {
      "o1": "bar",
      "o2": "bar",
      "o3": "bar",
      "o7": "bar"
    },
    "colors": {
      "o1": "rgba(0, 255, 0, 1)",
      "o2": "rgba(106, 255, 0, 1)",
      "o3": "rgba(212, 255, 0, 1)",
      "o7": "rgba(255, 0, 10, 1)"
    },
    "axes": {
      "o1": "y",
      "o2": "y",
      "o3": "y",
      "o7": "y"
    },
    "groups": [
      [
        "o1",
        "o2",
        "o3",
        "o7"
      ]
    ],
    "order": null,
    "labels": false
  }
             */
        });

    });

    describe('$$.convertJsonToData', () => {

        it('converts JSON as object (no keys provided)', () => {
            const data = $$.convertJsonToData({
                data1: [ 90, 40, 50, 120, 80, 90 ],
                data2: [ 120, 160, 200, 160, 130, 220 ],
                data3: [ 300, 240, 290, 230, 300, 320 ]
            });

            expect(data).toEqual({
                keys: ['data1', 'data2', 'data3'],
                rows: [{
                    data1: 90,
                    data2: 120,
                    data3: 300
                }, {
                    data1: 40,
                    data2: 160,
                    data3: 240
                }, {
                    data1: 50,
                    data2: 200,
                    data3: 290
                }, {
                    data1: 120,
                    data2: 160,
                    data3: 230
                }, {
                    data1: 80,
                    data2: 130,
                    data3: 300
                }, {
                    data1: 90,
                    data2: 220,
                    data3: 320
                }]
            });
        });

        it('converts JSON as rows (keys provided)', () => {
            const data = $$.convertJsonToData([{
                data1: 90,
                data2: 120,
                data3: 300,
                unused: 42
            }, {
                data1: 40,
                data2: 160,
                data3: 240,
                unused: 42
            }, {
                data1: 50,
                data2: 200,
                data3: 290,
                unused: 42
            }, {
                data1: 120,
                data2: 160,
                data3: 230,
                unused: 42
            }, {
                data1: 80,
                data2: 130,
                data3: 300,
                unused: 42
            }, {
                data1: 90,
                data2: 220,
                data3: 320,
                unused: 42
            }], {
                value: [ 'data1', 'data2', 'data3' ]
            });

            expect(data).toEqual({
                keys: ['data1', 'data2', 'data3'],
                rows: [{
                    data1: 90,
                    data2: 120,
                    data3: 300
                }, {
                    data1: 40,
                    data2: 160,
                    data3: 240
                }, {
                    data1: 50,
                    data2: 200,
                    data3: 290
                }, {
                    data1: 120,
                    data2: 160,
                    data3: 230
                }, {
                    data1: 80,
                    data2: 130,
                    data3: 300
                }, {
                    data1: 90,
                    data2: 220,
                    data3: 320
                }]
            });
        });

    });
});
