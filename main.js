const Discord = require("discord.js");
const axios = require("axios");
let busy = false;

// this discord bot will send a request to a gradio server

const client = new Discord.Client({
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: true,
  },
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_PRESENCES",
    "GUILD_MEMBERS",
    "GUILD_MESSAGE_REACTIONS",
  ],
});

client.login(
  "MTAyMTk3ODc1MzI4MDI0NTgyMw.Gu6DGW.C66UUlWag9LwvM9T_YB-pJjs4Q5MnbO_mCNPN0"
);

const prefix = "!";

client.once("ready", () => {
  console.log("FUULBO!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "soñar" && busy) {
    message.channel.send("Ya estoy soñando, espera un poco");
  }
});

let options = {
  method: "POST",
  url: "http://127.0.0.1:7860/api/predict",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0",
    Accept: "*/*",
    "Accept-Language": "es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: "http://127.0.0.1:7860/",
    "Content-Type": "application/json",
    Origin: "http://127.0.0.1:7860",
    Connection: "keep-alive",
    Cookie: "firstVisit=1663034815131",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
  },
  data: {
    fn_index: 10,
    data: [
      "prompt",
      "",
      "None",
      "None",
      15,
      "Euler a",
      false,
      false,
      1,
      1,
      7,
      -1,
      -1,
      0,
      0,
      0,
      512,
      512,
      false,
      false,
      0.7,
      "None",
      "Seed",
      "",
      "Steps",
      "",
      true,
      false,
      false,
      null,
      "",
      null,
      "",
      "",
    ],
    session_hash: "kpdlijut09n",
  },
};

const options_check = {
  method: "POST",
  url: "http://127.0.0.1:7860/api/predict",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0",
    Accept: "*/*",
    "Accept-Language": "es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: "http://127.0.0.1:7860/",
    "Content-Type": "application/json",
    Origin: "http://127.0.0.1:7860",
    Connection: "keep-alive",
    Cookie: "firstVisit=1663034815131",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
  },
  data: { fn_index: 5, data: [], session_hash: "kpdlijut09n" },
};

function parseMessage(message) {
  message = message.replace(prefix + "Soñar ", "");

  // check the prompt for parameters and return an object without them
  // if the prompt contein a parameter, store the value in the object
  // if there are no parameters, return the prompt without the parameter
  // check for the parameters separator "--"+value

  if (message.includes("--")) {
    let prompt = message.split("--")[0];
    options.data.data[0] = prompt;
    let parameters = message.split("--")[1].split(" ");
    let parametersObj = {};
    for (let i = 0; i < parameters.length; i++) {
      if (parameters[i].includes("=")) {
        let key = parameters[i].split("=")[0];
        let value = parameters[i].split("=")[1];
        parametersObj[key] = value;
        if (key === "steps") {
            // convert the steps to a number
            options.data.data[4] = parseInt(value);
        }
      }
    }
  } else {
    options.data.data[0] = message;
    console.log("no parameters");
  }
      // split the prompt using "###" as separator, the first part is the prompt and the second part is the negative prompt
      if (message.includes("###")) {
      negative_prompt = options.data.data[0].split("###")[1];
        options.data.data[0] = options.data.data[0].split("###")[0];
        options.data.data[1] = negative_prompt;
      }

  return options.data.data;
}

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  // parse the message and send it to the server with axios
  if (command === "soñar" && !busy) {
    busy = true;
    message.channel.send("Enviando petición...");

    let data = parseMessage(message.content);
    console.log("====================================");
    console.log(options.data.data);
    console.log("====================================");

    let text;
    // console.log(data)
    axios
      .request(options)
      .then(function (response) {
        console.log("Respondio #######################");
        //console.log(response.data);
        //console.log("response #######################");
        //console.log("response.data");
        //console.log(response.data.data[0]);

        // message.channel.send(text_human);
        // message.channel.send(response.data.data[0]);
        // convert response.data.data[0] to string

        let imagestring = JSON.stringify(response.data.data[0]);
        const attachment = new Discord.MessageAttachment(
          Buffer.from(imagestring.split(",")[1], "base64"),
          "image.png"
        );

        message.channel.send("Imagen:", attachment);
        function convertText() {
          let text = response.data.data[1];
          // The response looks like this:
          // {"prompt": "ooSo\u00f1ar Sue\u00f1o lucido", "all_prompts": ["ooSo\u00f1ar Sue\u00f1o lucido"], "negative_prompt": "back and white", "seed": 858968741, "all_seeds": [858968741], "subseed": 433856845, "all_subseeds": [433856845], "subseed_strength": 0, "width": 512, "height": 512, "sampler_index": 0, "sampler": "Euler a", "cfg_scale": 7, "steps": 7, "batch_size": 1, "restore_faces": false, "face_restoration_model": null, "sd_model_hash": "0b8c694b", "seed_resize_from_w": 0, "seed_resize_from_h": 0, "denoising_strength": null, "extra_generation_params": {}, "index_of_first_image": 0}
          // We want to extract the text from the "prompt" field
          // The text is in the format "ooSoñar Sueño lucido"
          // We want to remove the "oo" and the "ñ" and replace the "ñ" with "n"
          let prompt = text.split('"prompt": "')[1].split('"')[0];
          // and split the negative prompt
          let negative_prompt = text
            .split('"negative_prompt": "')[1]
            .split('"')[0];

          let text_human = "Prompt: " + prompt+ "\n" + "Negative prompt: " + negative_prompt + "\n" + "Steps: " + options.data.data[4];
          text_human = text_human.replace("oo", "");
          text_human = text_human.replace("ñ", "n");
          return text_human;
        }
        // wait 2 seconds to send the text
        setTimeout(function () {
          message.channel.send(convertText());
          busy = false;
        }, 1000);
      })
      .catch(function (error) {
        console.log(error);
      });
    // check every second if the server is ready to receive a new request
    let interval = setInterval(function () {
      axios
        .request(options_check)
        .then(function (response) {
          //console.log("Checkeando ###########oooooooooooo############");
          //console.log(response.data);
          //console.log("###########ooooooooooo############");
          let porcent_info = JSON.stringify(response.data.data[0]);
          // `<span style='display: none'>1663801490.8317158</span><p><div class='progressDiv'><div class='progress' style="width:26.666666666666668%">26%</div></div></p>`,
          let porcent = porcent_info.split("width:")[1].split("%")[0];
          console.log(porcent);
          // send the progress to the discord channel updating the message
          // remove the decimals
          porcent = porcent.split(".")[0];
          message.channel.send("Procesando pedido... " + porcent + "%");
          // if the server is ready to receive a new request, stop checking
          // or if the server respond with an empty message, stop checking
          // of if .catch is called, stop checking
          if (
            response.data.data[0] == "" ||
            response.data.data[0] == null ||
            response.data.data[0] == undefined
          ) {
            clearInterval(interval);
            console.log("Se termino de procesar el pedido");
            message.channel.send("Pocos segundos restantes...");
          }
          // if the progress is higher than 75%, stop checking
          if (porcent > 75) {
            clearInterval(interval);
            console.log("Se termino de procesar el pedido");
            message.channel.send("Pocos segundos restantes...");
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }, 4500);
  }
});

// A help command to explain how to use the bot
client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === "ayudamessi") {
    message.channel.send(
      "Para pedir un sueño, escribir: !Soñar (Algo que quieras ver) ### (Algún texto que no quieras ver)" + "\n\n" + 
      "Por ejemplo: !Soñar Un perro ### Un chigugua" + "\n\n"+
      "Si no necesitas un prompt negativo puedes simplemente no poner los ###" + "\n\n" + 
      "Si necesitas inspiración, puedes mirar lo que genero otra gente aqui! https://lexica.art/" + "\n\n" +
    "se puede especificar la cantidad de pasos con --steps=(numero de pasos)");
  }
  if (command === "despertar") {
    message.channel.send("Despertando...");
    busy = false;
  }
});

// Send a message to the channel with the percentage of completion

// console.log("response.data.data[1]");
// console.log(response.data.data[1]);
// console.log("response.data.data[2]");
// console.log(response.data.data[2]);
// console.log("response.data.data[3]");
