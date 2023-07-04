import { createConnector, 
          insert, //
          createTable, //
          kwil_create_tables,
          sql_columns, //
          sql_tables, //
          sql_table_data,//
        } from "../lib/api"
import { useState } from "react"
import Image from "next/image"
import { pKey, 
          secretPassword, 
          } from "../lib/constant";


export default function Home() {

  //////////////////////STATES/////////////////////
  const [tables, setTables] = useState([])
  const [columns, setColumns] = useState([])

  const [db, setDb] = useState("")
  const [host_sql, setHost_sql] = useState("")
  const [user, setUser] = useState("")
  const [pwd, setPwd] = useState("")
  const [sql_status, setSql_status] = useState(false)

  const [moat, setMoat] = useState("test777")
  const [host_kwil, setHost_kwil] = useState("test-db.kwil.xyz")
  const [secret, setSecret] = useState(pKey)
  const [wallet, setWallet] = useState(secretPassword)
  const [kwil_status, setKwil_status] = useState(false)

  const [log, setLog] = useState("")
  const [k, setK] = useState({})

  // const [db, setDb] = useState("")
  //////////////////////////////////////////////////////////////////

  //createMoat()
  // createMoat()
  // const kwil = createConnector()
  // const kwil = createConnector({h:host_kwil,m:moat,pk:secret,sp:wallet})
  // createTable(kwil, "DROP TABLE reservations")
  //////////////////////// HANDLERS & FUNCTIONS ////////////////////
  var d = {
    db: db,
    host: host_sql,
    user: user,
    pwd: pwd
  }


  const handleTable = () => {  
    setLog(" Connecting to SQL_DB...")  
    sql_tables(d).then(res => {
      var tabs = []
      for(let tab of res.tables){
          tabs.push(tab.TABLE_NAME)
          getColumn(tab.TABLE_NAME, d)
      }
      setTables(tabs)
    }) 
    
    setSql_status(true)    
  }

  const handleKwil = () => {
    
    setLog(" Configured Kwil SecretPassword!")  

  }

  const handleMigrate = () => {
    setLog("Migrating SQL_DB data to KwilDB...")
    var queries = kwil_create_tables(columns)
    

    //createMoat()
    const kwil = createConnector({h:host_kwil,m:moat,pk:secret,sp:wallet})
    for(let query of queries){
      createTable(kwil, query)
    }

    for(let tab of tables){

      sql_table_data(tab, d).then(response => {

        //
        for(let obj of response.data){
          var q = "INSERT INTO "+ tab +"("
          var vv = "VALUES("
          var values = [] //"VALUES("
          let i = 1
          for(const [k, v] of Object.entries(obj)){
            
            q = q + k.toLowerCase()+","
            vv = vv +"$"+ i +","
            values.push(v)
            i =i+1
          }

          q = q.slice(0,-1) + ") "
          vv = vv.slice(0,-1) + ")"
          q = q + vv

          insert(kwil, q, values).then(res=>{
            
          })
        }
      })      
    }

    // setLog("Migrated SQL_DB table to Kwil tables successfuly!")
    
  }

   const getColumn = (table_name,d) => {
    const res = sql_columns(table_name, d).then(res => {
      var cols = []
      
      for(let col of res.columns){
          cols.push(col.COLUMN_NAME)
      }
      var tmp = columns
      tmp[table_name] = cols
      
      setColumns(tmp)
    })
  }
  //////////////////////////////forms handlers///////////////////////////////

  ////////////////////////////////////////////////////////////////////

  return (
    <div className="border rounded-lg shadow-2xl 
              hover:shadow-xl hover:shadow-slate-900 
              shadow-black border-red-300 bg-white 
              max-w-6xl mx-auto duration-300 mt-10">
        <br/>
        <div className="flex justify-center">
            <h1 width={128} height={128}>QDBSync</h1>
        </div>

        <p className="text-slate-600 font-mono font-semibold text-xl ml-3">
          SQL DB config
        </p>
        {
          !sql_status? 
          
          (<div className="grid grid-cols-5 mx-auto">
              <div className="">
                  <p className="text-slate-600 font-mono text-sm ml-3">
                    *Instance
                  </p>
                  <input className="text-slate-600 font-mono font-bold text-sm ml-3 
                                    border border-slate-400 px-3 py-2
                                    hover:border-purple-600 duration-300"
                        placeholder="localhost" required
                        onChange={e => setHost_sql(e.target.value)}></input>
              </div>
              <div className="">
                  <p className="text-slate-600 font-mono text-sm ml-2">
                    *Database
                  </p>
                  <input className="text-slate-600 font-mono text-sm ml-2
                                    border border-slate-400 px-3 py-2
                                    hover:border-purple-600 duration-300"
                        placeholder="Trucks"
                        onChange={e => setDb(e.target.value)}></input>
              </div>
              <div className="">
                  <p className="text-slate-600 font-mono text-sm ml-1">
                    *User
                  </p>
                  <input className="text-slate-600 font-mono text-sm ml-1
                                    border border-slate-400 px-3 py-2
                                    hover:border-purple-600 duration-300"
                        placeholder="John Doe"
                        onChange={e => setUser(e.target.value)}></input>
              </div>
              <div className="">
                  <p className="text-slate-600 font-mono text-sm">
                    *Password
                  </p>
                  <input className="text-slate-600 font-mono text-sm 
                                    border border-slate-400 px-3 py-2
                                    hover:border-purple-600 duration-300"
                        placeholder="******"
                        type={"password"}
                        onChange={e => setPwd(e.target.value)}></input>
              </div>

              <div className="">
                  <p className="text-slate-600 font-mono text-sm">
                    **must be provided
                  </p>
                  <button className="font-mono text-sm rounded
                                    bg-slate-600 text-white
                                    border border-slate-400 px-10 py-2
                                    hover:bg-purple-600 duration-300"
                        placeholder="localhost:3036" onClick={handleTable}>Connect</button>
              </div>
          </div>)
        :
        (<button className="font-mono text-sm rounded
                bg-green-600 text-white ml-3
                border border-slate-400 px-10 py-2
                hover:bg-green-700 duration-300"
                >Connected to SQL_DB</button>)  
      }

        <p className="text-slate-600 font-mono font-semibold text-xl ml-3 mt-10">
          KwilDB config
        </p>
        {
          kwil_status?
          (
            <button onClick={handleKwil} className="font-mono text-sm rounded
                bg-green-600 text-white
                border border-slate-400 px-10 py-2
                hover:bg-green-700 duration-300"
                >Connected to KwilMoat</button>
          )
          : 
          (
            <div className="grid grid-cols-5 mx-auto">
                <div className="">
                    <p className="text-slate-600 font-mono text-sm ml-3">
                      *Host
                    </p>
                    <input className="text-slate-600 font-mono font-bold text-sm ml-3 
                                      border border-slate-400 px-3 py-2
                                      hover:border-purple-600 duration-300"
                          placeholder="xxx.kwil.xyz" defaultValue={"test-db.kwil.xyz"}
                          onChange={e => setHost_kwil(e.target.value)}></input>
                </div>
                <div className="">
                    <p className="text-slate-600 font-mono text-sm ml-2">
                      *Moat
                    </p>
                    <input className="text-slate-600 font-mono text-sm ml-2
                                      border border-slate-400 px-3 py-2
                                      hover:border-purple-600 duration-300"
                          placeholder="test123" defaultValue={"test777"}
                          onChange={e => setMoat(e.target.value)}></input>
                </div>
                <div className="">
                    <p className="text-slate-600 font-mono text-sm ml-1">
                      *privateKey
                    </p>
                    <input className="text-slate-600 font-mono text-sm ml-1
                                      border border-slate-400 px-3 py-2
                                      hover:border-purple-600 duration-300"
                          placeholder="xff(*********"
                          type={"password"} defaultValue={JSON.stringify(pKey)}
                          onChange={e => setSecret(e.target.value)}></input>
                </div>
                <div className="">
                    <p className="text-slate-600 font-mono text-sm">
                      *Secret
                    </p>
                    <input className="text-slate-600 font-mono text-sm 
                                      border border-slate-400 px-3 py-2
                                      hover:border-purple-600 duration-300"
                          placeholder="*******"
                          type={"password"} defaultValue={secretPassword}
                          onChange={e => setWallet(e.target.value)}></input>
                </div>

                <div className="">
                    <p className="text-slate-600 font-mono text-sm">
                      **must be provided
                    </p>
                    <button className="font-mono text-sm rounded
                                      bg-green-600 text-white
                                      border border-slate-400 px-5 py-2
                                       duration-300"
                                      
                                  >Connected to moat</button>
                </div>
            </div>
          )
        }
        {/* -------------------------------------------------------------- */}
        
        <p className="text-slate-600 font-mono font-semibold text-xl ml-3 mt-10">
          Migration option
        </p>
        <div className="flex justify-start ml-5 mt-2">
            <div className="form-check">
              <input className="form-check-input appearance-none rounded-full 
                        h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600
                        checked:border-blue-600 focus:outline-none transition 
                        duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain
                         float-left mr-2" type="radio" checked disabled/>
              <label className="form-check-label inline-block text-gray-800 opacity-50" >
                All tables
              </label>
            </div>
            <div className="form-check ml-10">
              <input className="form-check-input appearance-none rounded-full h-4 w-4 border
                       border-gray-300 bg-white checked:bg-blue-600 
                       checked:border-blue-600 focus:outline-none transition
                        duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain
                         float-left mr-2" type="radio" disabled/>
              <label className="form-check-label inline-block text-gray-800 opacity-50" >
                Specifics tables
              </label>
            </div>
        </div>

        {/* -------------------------------------------------------------------- */}
        <div className="mt-5">
          <hr />
            <div className="w-full  h-64 mt-5 grid grid-cols-5 px-4 py-4">
                <div className="form-check">
                      <input type={"checkbox"} className="mr-1" defaultChecked></input>
                      <label className=" inline-block text-gray-800">
                        Table
                      </label>
                  </div>
                  <div className="form-check">
                      <input type={"checkbox"} className="mr-1" defaultChecked></input>
                      <label className=" inline-block text-gray-800">
                        Table
                      </label>
                  </div>
            </div>
            
            <p className="text-slate-600 font-mono text-sm ml-5">
                      Log: {log}
            </p>
            <div className="flex mx-auto justify-center gap-10">
                <a href={"/"}>  
                      <button className="font-mono text-sm rounded-md flex
                                bg-white text-[#3E14CD]
                                border border-[#3E14CD] px-16 py-3
                                hover:bg-[#b199ff] duration-700">
                      Cancel()
                      </button>
                </a>
                
                <button onClick={handleMigrate} className="font-mono text-sm rounded-md
                              bg-[#00116C] text-white
                              border border-slate-400 px-16 py-3
                              hover:bg-[#3E14CD] duration-300">
                    MIGRATE
                </button>
            </div>
        </div>

        <br/>
    </div>
  )
}
