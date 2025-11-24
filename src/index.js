import { Client, Databases, ID, Query } from "node-appwrite";

// Inicializa o cliente
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

export default async ({ req, res, log, error }) => {
  try {
    const body = JSON.parse(req.body);
    const action = body.action;

    // Criar Tarefa
    if (action === "create") {
      const tarefa = {
        title: body.title,
        description: body.description,
      };

      const novoDocumento = await databases.createDocument(
        process.env.DATABASE_ID,
        process.env.COLLECTION_ID,
        ID.unique(),
        tarefa
      );

      log(`Documento criado com ID: ${novoDocumento.$id}`);
      return res.json(novoDocumento);
    }

    // Listar Tarefa
    if (action === "list") {
      const resultado = await databases.listDocuments(
        process.env.DATABASE_ID,
        process.env.COLLECTION_ID,
        [Query.orderDesc("$createdAt")]
      );

      log("Resultado:");
      log(JSON.stringify(resultado, null, 2));
    
      return res.json(resultado);
    }

    // Se a ação não for reconhecida
    return res.json({ error: "Ação inválida" }, 400);

  } catch (e) {
    error(`Erro: ${e.message}`);
    return res.json({ error: "Erro interno do servidor" }, 500);
  }
};
