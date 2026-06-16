require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { ObjectId } = require("mongodb");

const {
    conectarBanco,
    getDb
} = require("./database/mongo");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);

app.get("/", (req, res) => {
    res.send("API Biblioteca Virtual");
});

/*const { getDb } = require("./database/mongo");*/

app.post("/login", async (req, res) => {

    const { email, senha } = req.body;

    const db = getDb();

    const usuario = await db.collection("usuarios").findOne({
        email: email
    });

    if (!usuario) {
        return res.status(401).json({
            mensagem: "Usuário não encontrado"
        });
    }

    if (usuario.senhaHash !== senha) {
        return res.status(401).json({
            mensagem: "Senha inválida"
        });
    }

    res.json({

    sucesso: true,

    nome: usuario.nome,

    email: usuario.email,

    perfil: usuario.perfil,

    status: usuario.status

    });

});

app.post("/cadastro", async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

        const db = getDb();

        const usuarioExistente =
            await db.collection("usuarios")
            .findOne({ email });

        if (usuarioExistente) {

            return res.status(400).json({
                mensagem: "Email já cadastrado."
            });

        }

        const novoUsuario = {

            nome,
            email,

            senhaHash: senha,

            perfil: "leitor",

            status: "ativo",

            dataCadastro: new Date(),

            favoritos: [],

            emprestimosAtivos: [],

            historicoEmprestimos: [],

            preferencias: {
                categoriasFavoritas: [],
                idiomaPreferido: "Português"
            },

            penalidades: []
        };

        await db
            .collection("usuarios")
            .insertOne(novoUsuario);

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso."
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }

});

app.get("/dashboard", async (req, res) => {

    try {

        const db = getDb();

        const totalUsuarios =
            await db.collection("usuarios")
            .countDocuments();

        const totalLivros =
            await db.collection("livros")
            .countDocuments();

        const totalAuditorias =
            await db.collection("auditoria")
            .countDocuments();

        const usuariosSuspensos =
            await db.collection("usuarios")
            .countDocuments({
                status: "suspenso"
            });

        const usuariosBanidos =
            await db.collection("usuarios")
            .countDocuments({
                status: "banido"
            });

        res.json({
            totalUsuarios,
            totalLivros,
            totalAuditorias,
            usuariosSuspensos,
            usuariosBanidos
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao carregar dashboard."
        });

    }

});

app.get("/livros", async (req, res) => {

    try {

        const db = getDb();

        const livros =
            await db
            .collection("livros")
            .find()
            .toArray();

        res.json(livros);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar livros."
        });

    }

});

app.post("/livros", async (req, res) => {

    try {

        const db = getDb();

        const {

            titulo,

            autorNome,

            autorPais,

            isbn,

            categorias,

            tags,

            descricao,

            anoPublicacao,

            editora,

            idioma,

            paginas,

            estoque

        } = req.body;

        const novoLivro = {

            titulo,

            autor: {
                nome: autorNome,
                pais: autorPais
            },

            isbn,

            categorias:
                categorias
                .split(",")
                .map(c => c.trim()),

            tags:
                tags
                .split(",")
                .map(t => t.trim()),

            descricao,

            anoPublicacao:
                Number(anoPublicacao),

            editora,

            idioma,

            paginas:
                Number(paginas),

            estoque:
                Number(estoque),

            disponiveis:
                Number(estoque),

            reservas: [],

            avaliacoes: [],

            estatisticas: {
                mediaNotas: 0,
                totalAvaliacoes: 0
            }
        };

        await db
            .collection("livros")
            .insertOne(novoLivro);

        res.status(201).json({
            mensagem:
                "Livro cadastrado com sucesso."
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem:
                "Erro ao cadastrar livro."
        });

    }

});

app.delete("/livros/:id", async (req, res) => {

    try {

        const db = getDb();

        const { id } = req.params;

        await db.collection("livros")
            .deleteOne({
                _id: new ObjectId(id)
            });

        res.json({
            mensagem: "Livro excluído com sucesso."
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao excluir livro."
        });

    }

});

app.get("/livros/busca/:texto", async (req, res) => {

    try {

        const db = getDb();

        const { texto } = req.params;

        const livros =
            await db.collection("livros")
            .find({
                titulo: {
                    $regex: texto,
                    $options: "i"
                }
            })
            .toArray();

        res.json(livros);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro na busca."
        });

    }

});

app.get("/livros/tag/:tag", async (req, res) => {

    try {

        const db = getDb();

        const { tag } = req.params;

        const livros =
            await db.collection("livros")
            .find({
                tags: {
                    $regex: `^${tag}$`,
                    $options: "i"
                }
            })
            .toArray();

        res.json(livros);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar tag."
        });

    }

});

app.get("/estatisticas/categorias", async (req, res) => {

    try {

        const db = getDb();

        const resultado =
            await db.collection("livros")
            .aggregate([
                {
                    $unwind: "$categorias"
                },
                {
                    $group: {
                        _id: "$categorias",
                        quantidade: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        quantidade: -1
                    }
                }
            ])
            .toArray();

        res.json(resultado);

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro."
        });

    }

});

app.get("/estatisticas/avaliacoes", async (req, res) => {

    try {

        const db = getDb();

        const resultado =
            await db.collection("livros")
            .find()
            .sort({
                "estatisticas.mediaNotas": -1
            })
            .limit(5)
            .toArray();

        res.json(resultado);

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro."
        });

    }

});

app.get("/estatisticas/usuarios", async (req, res) => {

    try {

        const db = getDb();

        const resultado =
            await db.collection("usuarios")
            .aggregate([
                {
                    $group: {
                        _id: "$status",
                        quantidade: {
                            $sum: 1
                        }
                    }
                }
            ])
            .toArray();

        res.json(resultado);

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro."
        });

    }

});

app.get("/estatisticas/reservas", async (req, res) => {

    try {

        const db = getDb();

        const resultado =
            await db.collection("livros")
            .aggregate([
                {
                    $project: {
                        totalReservas: {
                            $size: "$reservas"
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$totalReservas"
                        }
                    }
                }
            ])
            .toArray();

        res.json(resultado);

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro."
        });

    }

});

app.get("/usuarios", async (req, res) => {

    try {

        const db = getDb();

        const usuarios =
            await db
            .collection("usuarios")
            .find()
            .toArray();

        res.json(usuarios);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar usuários."
        });

    }

});

app.put("/usuarios/suspender/:id", async (req, res) => {

    try {

        const db = getDb();

        await db.collection("usuarios")
            .updateOne(
                {
                    _id: new ObjectId(
                        req.params.id
                    )
                },
                {
                    $set: {
                        status: "suspenso"
                    }
                }
            );

        res.json({
            mensagem: "Usuário suspenso."
        });

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro."
        });

    }

});

app.put("/usuarios/banir/:id", async (req, res) => {

    try {

        const db = getDb();

        await db.collection("usuarios")
            .updateOne(
                {
                    _id: new ObjectId(
                        req.params.id
                    )
                },
                {
                    $set: {
                        status: "banido"
                    }
                }
            );

        res.json({
            mensagem: "Usuário banido."
        });

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro."
        });

    }

});

app.delete("/usuarios/:id", async (req, res) => {

    try {

        const db = getDb();

        await db.collection("usuarios")
            .deleteOne({
                _id: new ObjectId(
                    req.params.id
                )
            });

        res.json({
            mensagem:
                "Usuário excluído."
        });

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro."
        });

    }

});

app.put("/livros/reservar/:id", async (req, res) => {

    try {

        const db = getDb();

        const livro =
            await db.collection("livros")
            .findOne({
                _id: new ObjectId(
                    req.params.id
                )
            });

        if (livro.disponiveis <= 0) {

            return res.status(400).json({
                mensagem:
                "Livro indisponível."
            });

        }

        await db.collection("livros")
            .updateOne(
                {
                    _id: new ObjectId(
                        req.params.id
                    )
                },
                {
                    $push: {
                        reservas: {
                            usuario: "Leitor",
                            dataReserva:
                                new Date()
                        }
                    },

                    $inc: {
                        disponiveis: -1
                    }
                }
            );

        res.json({
            mensagem:
                "Reserva realizada."
        });

    } catch (erro) {

        res.status(500).json({
            mensagem:
                "Erro ao reservar."
        });

    }

});

app.put("/livros/avaliar/:id", async (req, res) => {

    try {

        const db = getDb();

        const { nota, comentario } =
            req.body;

        const livro =
            await db.collection("livros")
            .findOne({
                _id: new ObjectId(
                    req.params.id
                )
            });

        const novaAvaliacao = {

            usuario: "Leitor",

            nota: Number(nota),

            comentario,

            data: new Date()
        };

        const avaliacoes = [
            ...(livro.avaliacoes || []),
            novaAvaliacao
        ];

        const totalAvaliacoes =
            avaliacoes.length;

        const somaNotas =
            avaliacoes.reduce(
                (soma, a) =>
                    soma + a.nota,
                0
            );

        const mediaNotas =
            Number(
                (
                    somaNotas /
                    totalAvaliacoes
                ).toFixed(2)
            );

        await db.collection("livros")
            .updateOne(
                {
                    _id: new ObjectId(
                        req.params.id
                    )
                },
                {
                    $push: {
                        avaliacoes:
                            novaAvaliacao
                    },

                    $set: {
                        "estatisticas.mediaNotas":
                            mediaNotas,

                        "estatisticas.totalAvaliacoes":
                            totalAvaliacoes
                    }
                }
            );

        res.json({
            mensagem:
                "Avaliação registrada."
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem:
                "Erro ao avaliar."
        });

    }

});

app.get("/livros/:id", async (req, res) => {

    try {

        const db = getDb();

        const livro =
            await db.collection("livros")
            .findOne({
                _id: new ObjectId(
                    req.params.id
                )
            });

        res.json(livro);

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro."
        });

    }

});

app.put("/livros/:id", async (req, res) => {

    try {

        const db = getDb();

        const {

            titulo,

            categorias,

            tags,

            estoque,

            descricao

        } = req.body;

        await db.collection("livros")
            .updateOne(
                {
                    _id: new ObjectId(
                        req.params.id
                    )
                },
                {
                    $set: {

                        titulo,

                        categorias:
                            categorias
                            .split(",")
                            .map(c => c.trim()),

                        tags:
                            tags
                            .split(",")
                            .map(t => t.trim()),

                        estoque:
                            Number(estoque),

                        descricao

                    }
                }
            );

        res.json({
            mensagem:
                "Livro atualizado."
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem:
                "Erro ao atualizar."
        });

    }

});

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {

    await conectarBanco();

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });

}

iniciarServidor();