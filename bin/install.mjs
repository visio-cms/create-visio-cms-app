#!/usr/bin/env node
import { execSync } from "child_process";
import readline from "readline";
import ora from "ora";
import fs from "fs";
import path from "path";

const promptUserWithValidation = async (question, validateFn) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const ask = () => {
      rl.question(question, (answer) => {
        if (validateFn(answer)) {
          rl.close();
          resolve(answer);
        } else {
          console.log("Invalid input. Please enter a valid value.");
          ask();
        }
      });
    };

    ask();
  });
};

const targetDirectory =
  process.argv[2] ||
  (await promptUserWithValidation(
    "Enter a project name: ",
    (value) => !!value.trim()
  ));

const executeCommand = (command, message) => {
  try {
    const spinner = ora(message).start();
    execSync(command, { stdio: "ignore" });
    spinner.succeed();
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
};


try {
  // Clone the repository
  executeCommand(
    `git clone https://github.com/visio-cms/visio-cms-next-template.git ${targetDirectory} --quiet`,
    "Initializing project..."
  );

  // Change to the project directory
  process.chdir(targetDirectory);

  // Install the dependencies
  executeCommand("npm install visio-cms-lib@latest next@latest", "Installing dependencies ....");

  // Log success message
  console.log("\x1b[32m%s\x1b[0m", "Project initialized successfully.");
  
  // Log a URL to the documentation page for the user
  console.log("\nNext steps:");
  console.log(
    "To complete the configuration, please visit the following URL:"
  );
  console.log("\x1b[36m%s\x1b[0m", "https://docs.visiocms.com/quickstart#setup-steps");

} catch (error) {
  console.log("Failed initializing project.");
}
