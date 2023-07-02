const db = require('../db/dbConfig.js')
const express = require('express')
const { checkAuth } = require('../auth.js')
const router = express.Router()

router.post('/addEmail', async(req,res) => {
    try {
        const [addEmail] = await db('tbl_emails').insert({
            full_name: req.body.full_name,
            phone: req.body.phone,
            email: req.body.email,
            description: req.body.description,
            recived_date: new Date().toISOString().split('T')[0],
            seen_status: '0'
        })

        return res.sendStatus(200)
    } catch (error) {
        if(error.errno == 1062) {
            return res.status(500).send({
                message: 'The email was previously sent'
            })
        }
        return res.status(500).send(error)
    }
})

// router.patch('/updateEmail/:e_id', async(req,res) => {
//     try {
//         await db('tbl_emails').where('e_id', req.params.e_id).update({
//             full_name: req.body.full_name,
//             phone: req.body.phone,
//             email: req.body.email,
//             description: req.body.description,
//             recived_date: new Date().toISOString().split('T')[0],
//             seen_status: req.body.seen_status
//         })

//         return res.status(200).send()
//     } catch (error) {
//         return res.status(500).send(error)
//     }
// })

router.patch('/seeEmail/:e_id', checkAuth, async (req, res) => {
    try {
        await db('tbl_emails').where('e_id', req.params.e_id).update({
            seen_status: '1'
        });
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send({
            error
        });
    }
});

router.delete('/deleteEmail/:e_id', checkAuth, async(req,res) => {
    try {
        await db('tbl_emails').where('e_id', req.params.e_id).delete()
         return res.status(200).send()
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.get('/allEmails', checkAuth, async(req,res) => {
    const allEmails = await db('tbl_emails').select('*').orderBy('e_id', 'desc');
    return res.status(200).send(allEmails);
});

router.get('/getEmailDetail/:e_id', checkAuth, async (req, res) => {
    const [detail] = await db('tbl_emails').where('e_id', req.params.e_id).select('*');
    return res.status(200).send(detail);
});

router.get('/countNewEmails', checkAuth, async (req, res) => {
    const [{newEmails}] = await db('tbl_emails').where('seen_status', '0').count('* as newEmails');
    return res.status(200).send({
        newEmails
    });
});

router.get('/getEmailsByDate/:date', checkAuth, async (req, res) => {
    const allEmails = await db('tbl_emails').where('recived_date', req.params.date).select('*').orderBy('e_id', 'desc');
    return res.status(200).send(allEmails);
});

module.exports = router