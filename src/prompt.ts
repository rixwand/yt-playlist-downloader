import inquirer, {type Answers} from "inquirer";

const prompt = inquirer.createPromptModule()

const inputUrl = async () => {
   return prompt<{url: string}>([
     {type: "input", name: "url", message: "Enter Youtube URL: "},
   ])
}

export default {inputUrl}