import dotenv from 'dotenv'
import { listenCommand } from './listener.js'
dotenv.config()

async function start(){
    const a = await listenCommand()
    console.log('comando: ', a)
}

start()