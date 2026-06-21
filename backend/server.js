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

async function registrarAuditoria(
    acao,
    usuario,
    detalhes
) {

    const db = getDb();

    await db
    .collection("auditoria")
    .insertOne({

        acao,

        usuario,

        detalhes,

        data:
            new Date()

    });

}

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

async function registrarAuditoria(
    acao,
    usuario,
    detalhes
) {

    const db = getDb();

    await db.collection(
        "auditoria"
    ).insertOne({

        acao,

        usuario,

        detalhes,

        data:
            new Date()

    });

}

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

            solicitacaoExclusao: {
                solicitada: false,
                dataSolicitacao: null,
                motivo: ""

            },

            preferencias: {
                categoriasFavoritas: [],
                idiomaPreferido: "Português"
            },

            penalidades: []

        };

        await db
            .collection("usuarios")
            .insertOne(novoUsuario);

        await registrarAuditoria(

            "CADASTRO_USUARIO",

            email,

            `Novo usuário cadastrado: ${nome}`

        );

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

         const usuario = req.body.usuario;

        const livro =
            await db.collection("livros")
            .findOne({
                _id: new ObjectId(
                    req.params.id
                )
            });

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

                            usuarioId:
                                usuario.email,

                            nomeUsuario:
                                usuario.nome,

                            dataReserva:
                                new Date(),

                            status:
                                "ativa"
                        }
                    }
                }
            );

        await registrarAuditoria(

            "Reserva",

            usuario.email,

            livro.titulo

        );
        
        res.json({
            mensagem:
                "Reserva realizada."
        });

    } catch (erro) {

        console.error(erro);

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

        if (
            isNaN(nota) ||
            nota < 1 ||
            nota > 5
        ) {

            return res.status(400)
            .json({
                mensagem:
                "Nota inválida."
            });

}

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

        await registrarAuditoria(

            "Avaliação",

            "Leitor",

            livro.titulo
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

        await db.collection("livros")
        .updateOne(
            {
                _id:
                new ObjectId(
                    req.params.id
                )
            },
            {
                $set: {

                    titulo,

                    autor: {

                        nome:
                        autorNome,

                        pais:
                        autorPais

                    },

                    isbn,

                    categorias:
                        categorias
                        .split(",")
                        .map(
                            c => c.trim()
                        ),

                    tags:
                        tags
                        .split(",")
                        .map(
                            t => t.trim()
                        ),

                    descricao,

                    anoPublicacao:
                        Number(
                            anoPublicacao
                        ),

                    editora,

                    idioma,

                    paginas:
                        Number(
                            paginas
                        ),

                    estoque:
                        Number(
                            estoque
                        )

                }
            }
        );

        res.json({

            mensagem:
            "Livro atualizado."

        });

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500)
        .json({

            mensagem:
            "Erro ao atualizar."

        });

    }

});

app.put(
"/livros/emprestar/:id",
async (req, res) => {

    try {

        const db = getDb();

        const usuario =
            req.body.usuario;

        const livro =
            await db.collection("livros")
            .findOne({
                _id:
                new ObjectId(
                    req.params.id
                )
            });

        if (
            livro.disponiveis <= 0
        ) {

            return res.status(400)
            .json({
                mensagem:
                "Livro indisponível."
            });

        }

        const hoje =
            new Date();

        const devolucao =
            new Date();

        devolucao.setDate(
            devolucao.getDate() + 7
        );

        const emprestimo = {

            usuarioId:
                usuario.email,

            nomeUsuario:
                usuario.nome,

            dataEmprestimo:
                hoje,

            dataPrevistaDevolucao:
                devolucao,

            status:
                "ativo"

        };

        await db.collection("livros")
        .updateOne(
            {
                _id:
                new ObjectId(
                    req.params.id
                )
            },
            {
                $push: {
                    emprestimos:
                    emprestimo
                },

                $inc: {
                    disponiveis: -1
                }
            }
        );

        await db.collection("usuarios")
        .updateOne(
            {
                email: usuario.email
            },
            {
                $push: {
                    emprestimosAtivos: {

                        livroId:
                        livro._id,

                        titulo:
                        livro.titulo,

                        dataEmprestimo:
                        hoje,

                        dataPrevistaDevolucao:
                        devolucao,

                        status:
                        "ativo"
            }
        }
    }
);

        await registrarAuditoria(

            "Empréstimo",

            usuario.email,

            livro.titulo

        );

        res.json({
            mensagem:
            "Empréstimo realizado."
        });

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500)
        .json({
            mensagem:
            "Erro ao emprestar."
        });

    }

});

app.get(
"/emprestimos",
async (req, res) => {

    try {

        const db = getDb();

        const livros =
            await db.collection("livros")
            .find({
                "emprestimos.status":
                "ativo"
            })
            .toArray();

        res.json(
            livros
        );

    } catch (erro) {

        res.status(500)
        .json({
            mensagem:
            "Erro."
        });

    }

});

app.get(
"/emprestimos/:email",
async (req, res) => {

    try {

        const db = getDb();

        const livros =
            await db.collection(
                "livros"
            )
            .find({
                "emprestimos.usuarioId":
                req.params.email,

                "emprestimos.status":
                "ativo"
            })
            .toArray();

        res.json(
            livros
        );

    } catch (erro) {

        res.status(500)
        .json({
            mensagem: "Erro."
        });

    }

});

app.put(
"/livros/devolver/:id",
async (req, res) => {

    try {

        const db = getDb();

        const livro =
            await db.collection("livros")
            .findOne({
                _id:
                new ObjectId(
                    req.params.id
                )
            });

        const emprestimoAtivo =
            livro.emprestimos.find(
                e => e.status === "ativo"
            );

        if (!emprestimoAtivo) {

            return res.status(400)
            .json({
                mensagem:
                "Nenhum empréstimo ativo."
            });

        }

        const emprestimos =
            livro.emprestimos.map(
                e => {

                    if (
                        e === emprestimoAtivo
                    ) {

                        e.status =
                            "devolvido";

                    }

                    return e;

                }
            );

        await db.collection(
            "livros"
        )
        .updateOne(
            {
                _id:
                new ObjectId(
                    req.params.id
                )
            },
            {
                $set: {
                    emprestimos
                },

                $inc: {
                    disponiveis: 1
                }
            }
        );

        await db.collection(
            "usuarios"
        )
        .updateOne(
            {
                email:
                emprestimoAtivo.usuarioId
            },
            {

                $pull: {

                    emprestimosAtivos: {

                        titulo:
                        livro.titulo

                    }

                },

                $push: {

                    historicoEmprestimos: {

                        titulo:
                            livro.titulo,

                        dataEmprestimo:
                            emprestimoAtivo.dataEmprestimo,

                        dataDevolucao:
                            new Date()

                    }

                }

            }
        );

        await registrarAuditoria(

            "Devolução",

            emprestimoAtivo.usuarioId,

            livro.titulo

        );
        
        res.json({

            mensagem:
            "Livro devolvido."

        });

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500)
        .json({
            mensagem:
            "Erro."
        });

    }

});

app.get("/reservas/:email", async (req, res) => {

    try {

        const db = getDb();

        const livros =
            await db.collection(
                "livros"
            )
            .find({
                "reservas.usuarioId":
                req.params.email
            })
            .toArray();

        res.json(
            livros
        );

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500)
        .json({
            mensagem:
            "Erro."
        });

    }

});

app.put(
"/usuarios/reativar/:id",
async (req, res) => {

    try {

        const db = getDb();

        await db.collection(
            "usuarios"
        ).updateOne(
            {
                _id:
                new ObjectId(
                    req.params.id
                )
            },
            {
                $set: {
                    status: "ativo"
                }
            }
        );

        res.json({
            mensagem:
            "Usuário reativado."
        });

    } catch (erro) {

        res.status(500)
        .json({
            mensagem:
            "Erro ao reativar."
        });
    }

});

app.post(
"/admin/usuarios",
async (req, res) => {

    try {

        const db = getDb();

        const usuarioExistente =
            await db.collection(
                "usuarios"
            ).findOne({
                email:
                req.body.email
            });

        if (
            usuarioExistente
        ) {

            return res
            .status(400)
            .json({
                mensagem:
                "Email já cadastrado."
            });

        }

        const novoUsuario = {

            nome: req.body.nome,

            email: req.body.email,

            senhaHash: req.body.senhaHash,

            perfil: req.body.perfil,

            status: "ativo",

            telefone: req.body.telefone,

            endereco: req.body.endereco,

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
        
        await db.collection(
            "usuarios"
        ).insertOne(
            novoUsuario
        );

        res.json({
            mensagem:
            "Usuário criado."
        });

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500)
        .json({
            mensagem:
            "Erro ao criar usuário."
        });

    }

});

app.get(
"/usuarios/:id",
async (req, res) => {

    try {

        const db = getDb();

        const usuario =
            await db.collection(
                "usuarios"
            )
            .findOne({

                _id:
                new ObjectId(
                    req.params.id
                )

            });

        res.json(
            usuario
        );

    } catch (erro) {

        res.status(500)
        .json({
            mensagem:
            "Erro."
        });

    }

});

app.put(
"/usuarios/:id",
async (req, res) => {

    try {

        const db = getDb();

        await db.collection(
            "usuarios"
        ).updateOne(

            {
                _id:
                new ObjectId(
                    req.params.id
                )
            },

            {
                $set: {

                    nome:
                    req.body.nome,

                    email:
                    req.body.email,

                    telefone:
                    req.body.telefone,

                    endereco:
                    req.body.endereco,

                    perfil:
                    req.body.perfil,

                    status:
                    req.body.status

                }
            }

        );

        res.json({

            mensagem:
            "Usuário atualizado."

        });

    } catch (erro) {

        res.status(500)
        .json({
            mensagem:
            "Erro."
        });

    }

});

app.delete(
"/reservas/:livroId/:email",
async (req, res) => {

    try {

        const db = getDb();

        await db.collection(
            "livros"
        ).updateOne(
            {
                _id:
                new ObjectId(
                    req.params.livroId
                )
            },
            {
                $pull: {

                    reservas: {

                        usuarioId:
                        req.params.email

                    }

                }
            }
        );

        await registrarAuditoria(

            "Cancelamento Reserva",

            usuario.email,

            livro.titulo

        );
        
        res.json({

            mensagem:
            "Reserva cancelada."

        });

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500)
        .json({
            mensagem:
            "Erro ao cancelar."
        });

    }

});

app.put(
"/usuarios/solicitar-exclusao/:email",
async (req, res) => {

    try {

        const db = getDb();

        await db.collection(
            "usuarios"
        ).updateOne(
            {
                email:
                req.params.email
            },
            {
                $set: {

                    solicitacaoExclusao: {

                        solicitada: true,

                        dataSolicitacao:
                            new Date(),

                        motivo:
                            req.body.motivo

                    }

                }
            }
        );

        await registrarAuditoria(

            "Solicitação de Exclusão",

            req.params.email,

            req.body.motivo

        );

        res.json({

            mensagem:
            "Solicitação enviada."

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            mensagem:
            "Erro."

        });

    }

});

app.get(
"/solicitacoes-exclusao",
async (req, res) => {

    try {

        const db = getDb();

        const usuarios =
            await db.collection(
                "usuarios"
            )
            .find({
                "solicitacaoExclusao.solicitada":
                true
            })
            .toArray();

        res.json(
            usuarios
        );

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500)
        .json({
            mensagem:
            "Erro."
        });

    }

});

app.delete(
"/usuarios/aprovar-exclusao/:id",
async (req, res) => {

    try {

        const db = getDb();

        const usuario =
        await db.collection(
            "usuarios"
        )
        .findOne({
            _id:
            new ObjectId(
                req.params.id
            )
        });
        
        await db.collection(
            "usuarios"
        )
        .deleteOne({

            _id:
            new ObjectId(
                req.params.id
            )

        });

        await registrarAuditoria(

            "Exclusão Aprovada",

            usuario.email,

            usuario.nome

        );
        
        res.json({

            mensagem:
            "Usuário excluído."

        });

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500)
        .json({
            mensagem:
            "Erro."
        });

    }

});

app.put(
"/usuarios/rejeitar-exclusao/:id",
async (req, res) => {

    try {

        const db = getDb();

        const usuario =
            await db.collection(
                "usuarios"
            ).findOne({
                _id:
                new ObjectId(
                    req.params.id
                )
            });
        
        await db.collection(
            "usuarios"
        ).updateOne(
            {
                _id:
                new ObjectId(
                    req.params.id
                )
            },
            {
                $set: {

                    solicitacaoExclusao: {

                        solicitada: false,

                        dataSolicitacao: null,

                        motivo: ""

                    }

                }
            }
        );

        await registrarAuditoria(

            "Exclusão Rejeitada",

            usuario.email,

            usuario.nome

        );
        
        res.json({

            mensagem:
            "Solicitação rejeitada."

        });

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500)
        .json({
            mensagem:
            "Erro."
        });

    }

});

app.get(
"/usuarios/email/:email",
async (req, res) => {

    try {

        const db = getDb();

        const usuario =
            await db.collection(
                "usuarios"
            ).findOne({

                email:
                req.params.email

            });

        res.json(
            usuario
        );

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500)
        .json({
            mensagem:
            "Erro."
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