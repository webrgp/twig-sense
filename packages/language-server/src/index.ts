import { createConnection, ProposedFeatures } from "vscode-languageserver/node";
import { startServer } from "./server";

const connection = createConnection(ProposedFeatures.all);
startServer(connection);
