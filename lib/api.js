import KwilDB from "kwildb";
import { pKey, 
        secretPassword, 
        } from "./constant";



///////////////////////////////////KwilDB operations///////////////////////////////////////


export function createConnector(k) {

    const kwilDB = KwilDB.createConnector({
        host: k.h,
        protocol: 'https',
        moat: "test777",
        privateKey: pKey,
    }, secretPassword)

    return kwilDB
}

export async function createTable(kw, query){
    await kw.query(query, true)
}

export async function insert(kw, query, data){
    await kw.preparedStatement(query, data, true)
}

export async function select(kw, query, data){
    let result

    if(data.length == 0) {
        result = await kw.query(query, false)
    }else{
        result = await kw.query(query, data, false)
    }
    
    return result
}
export  function kwil_create_tables(cols) {
    var final = []
    if(cols == undefined) cols = []
    for(const [key, value] of Object.entries(cols)){

        var query = "CREATE TABLE "+key+"("
        query = query + value.join(" VARCHAR(20), ") + " VARCHAR(20) ) "
        final.push(query)
    }
    return final
}


//////////////////////////////////////SQL DB operations////////////////////////////////////


export async function sql_tables(d){
    const db=d.db
    const h=d.host
    const u=d.user
    const p=d.pwd
    var res = await fetch("/api/tables?db="+db+"&host="+h+"&user="+u+"&pwd="+p)
    var json = res.json()
    return json   
}

export async function sql_columns(table_name,d){
    const db=d.db
    const h=d.host
    const u=d.user
    const p=d.pwd
    var res = await fetch("/api/columns?db="+db+"&host="+h+"&user="+u+"&pwd="+p+"&table="+table_name)
    var json = res.json()
    return json
}

export async function sql_table_data(table_name, d){
    const db=d.db
    const h=d.host
    const u=d.user
    const p=d.pwd
    var res = await fetch("/api/data?table="+table_name+"&db="+db+"&host="+h+"&user="+u+"&pwd="+p)
    var json = res.json()
    return json  
}
