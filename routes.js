var effects = require('./effects');

exports.index = function(req, res) {
    effects.getAll(function(err, data) {
        res.render('index', {
            title: 'Elovalo Webide', // TODO: move to tpl
            effects: data,
            user: req.user
        });
    });
};

exports.editor = function(req, res) {
    var id = req.query.id;

    if(id) {
        effects.read(id, function(err, d) {
            res.render('editor', {
                title: 'Effect editor', // TODO: move to tpl
                initialCode: d,
                codeId: id,
                user: req.user
            });
        });
    }
    else {
        res.render('editor', {
            title: 'Effect editor', // TODO: move to tpl
            user: req.user,
            initialCode: undefined,
            codeId: undefined
        });
    }
};

exports.editorSave = function(req, res) {
    var code = req.param('code');
    var id = req.param('id') || req.session.effectId;
    var author = req.user.id;
    var status;

    // TODO: attach name
    // TODO: attach description
    // TODO: refactor status out and replace with 404
    if(code && author) {
        if(id) {
            effects.getMeta(id, function(err, d) {
                if(err) return res.json({status: 'error'});

                if(author == d.author) {
                    effects.commitEffect('Save effect', id, code, function(err) {
                        status = err? 'error': 'success';

                        res.json({status: status});
                    });
                }
                else {
                    // new author, fork
                }
            });
        }
        else {
            effects.create(author, code, function(err, d) {
                status = err? 'error': 'success';

                res.json({status: status});
                req.session.effectId = d.id;
            });
        }
    }
    else {
        res.json({status: 'error'});
    }
};

exports.effects = function(req, res) {
    var id = req.query.id;

    if(id) {
        effects.read(id, function(err, d) {
            if(err) return res.send(404);

            return res.send(d);
        });
    }
    else {
        effects.getAllMeta(function(err, d) {
            if(err) return res.send(404);

            return res.json(d);
        });
    }
};
