import dotenv from 'dotenv'
import recorder from 'node-record-lpcm16'
import { SpeechClient } from '@google-cloud/speech'
dotenv.config()

const client = new SpeechClient()

const encoding = 'LINEAR16'
const sampleRateHertz = 16000
const languageCode = 'pt-BR'

const request:any = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    },
    interimResults: false
}

const timeout = 7 //segundos

const listenCommand = () => new Promise<string>(resolve => {
    console.log('\n🎧 Ouvindo comando...')
    let timer:NodeJS.Timeout

    async function responseHandler(text:string) {
      destroyStream()
      clearTimeout(timer)
      resolve(text)
      // await handleCommand(text)
    }

    timer = setTimeout(() => {
      responseHandler('Default answer')
    }, timeout * 1000)

    const recognizeStream = client.streamingRecognize(request)

    recognizeStream.on('error', console.error)

    recognizeStream.on('data', data => {

      const text = data.results[0].alternatives[0].transcript
      console.log(`🎧 Comando: ${text}`)

      responseHandler(text)
    }
    );

    function destroyStream(){
      recognizeStream.destroy()
    }
      
    recorder
      .record({
        sampleRateHertz: sampleRateHertz,
        threshold: 0,
        verbose: false,
        recordProgram: 'rec', 
        silence: '10.0',
      })
      .stream()
      .on('error', console.error)
      .pipe(recognizeStream)
})

export {listenCommand}