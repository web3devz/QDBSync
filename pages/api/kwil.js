
import KwilDB from "kwildb";


export default function handler(req, res) {
  // var
  const host = req.query.host
  const moat = req.query.moat
  const sec = req.query.sec
  const wal = req.query.wal

  // connection
   
    const myMoat =  KwilDB.createMoat(
                        host, 
                        moat, 
                        sec, 
                        wal)
    const privateKey = myMoat.privateKey
    const secret = myMoat.secret

  
    res.status(200).json({data: {
            pkey: privateKey,
            secpass: secret
        }
    })
}