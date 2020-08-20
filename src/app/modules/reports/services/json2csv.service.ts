
export const json2csv = async function(columns: string[], data: object[]) {
  let csv = '';
  if (columns && Array.isArray(columns)) {
    csv = csv.concat(columns.join(',')).concat(',\n');
    data.forEach(element => {
      columns.forEach(column => {
          csv = csv.concat(element[column]).concat(', ');
      });
      csv = csv.concat('\n');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csv;
    const url = encodeURI(csvContent);
    window.open(url);
    return csv;
  }
  throw Error('CSV failed to crete');
  //   datas.map(data=>{
  //     const newData = {};
  //     Object.assign(newData, {columns[0]:})
  //     return {
  //
  //     }
  //   }).forEach(data=>{
  //     csv.concat(data)
  //   })
  // }
};
