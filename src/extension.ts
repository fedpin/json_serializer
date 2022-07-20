import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;

  let disposable = vscode.commands.registerCommand(
    "json-serializer.serialize",
    () => {
      if (editor) {
        const document = editor.document;

        const content = document.getText();
        const className = content.split("class ")[1].split("{")[0].trim();

        const allLines = content.split("\r\n");
        const variableLines = allLines.filter((line) => line.includes(`final`));

        const variableNameToType = new Map<string, string>();

        variableLines.forEach((line) => {
          const variableContent = line.split("final ")[1].split(" ");

          if (variableContent.length > 1) {
            variableNameToType.set(
              variableContent[1].replace(";", "").trim(),
              variableContent[0].trim()
            );
          } else if ()
        });

        editor.edit((editBuilder) => {
          let fromJsonString = "\r\n	";

          // Content fromJson
          fromJsonString += `factory ${className}.fromJson(Map<String, dynamic> json) =>\r\n`;
          fromJsonString += "	    " + `${className}(`;

          let counter = 0;
          variableNameToType.forEach((_, name) => {
            counter++;

            fromJsonString += `${name}: json['${name}']`;
            if (counter < variableNameToType.size) {
              fromJsonString += ", ";
            }
          });

          fromJsonString += ");";
          fromJsonString += "\r\n\r\n";

          // Content toJson
          fromJsonString += `	Map<String, dynamic> toJson() =>\r\n`;
          fromJsonString += "	    " + `{`;

          counter = 0;
          variableNameToType.forEach((_, name) => {
            counter++;

            fromJsonString += `'${name}': ${name}`;
            if (counter < variableNameToType.size) {
              fromJsonString += ", ";
            }
          });

          fromJsonString += "};";
          fromJsonString += "\r\n";

          editBuilder.insert(
            new vscode.Position(document.lineCount - 2, 0),
            fromJsonString
          );
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
