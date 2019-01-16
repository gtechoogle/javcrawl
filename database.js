var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'il0veandr0id',
    port: '3306',
    database: 'av'
});
//创建一个connection
connection.connect(function(err) {
    if (err) {
        console.log('[query] - :' + err);
        return;
    }
    console.log('[connection connect]  succeed!');
    var addSql = 'INSERT INTO id(ID,code,img_url) VALUES(0,?,?)';
    var addSqlParams = ['ab-103', 'https://c.runoob.com'];
    //增
    connection.query(addSql, addSqlParams, function(err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }

        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);        
        console.log('INSERT ID:', result);
        console.log('-----------------------------------------------------------------\n\n');
    });

    connection.end();
});

// connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });