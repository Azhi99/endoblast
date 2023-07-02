const db = require('../db/dbConfig.js')
const express = require('express')
const { checkAuth } = require('../auth.js')
const router = express.Router()

// router.post('/addContact', async(req,res) => {
//     try {
//         const [addContact] = await db('tbl_contact_us').insert({
//             phone: req.body.phone,
//             address: req.body.address,
//             email: req.body.email,
//             fb_link: req.body.fb_link,
//             insta_link: req.body.insta_link
//         })

//         return res.status(200).send()
//     } catch (error) {
//         return res.status(500).send(500)
//     }
// })

router.patch('/updateContact/:cu_id', checkAuth, async(req,res) => {
    try {
        await db('tbl_contact_us').where('cu_id', req.params.cu_id).update({
            phone: req.body.phone,
            address: req.body.address,
            email: req.body.email,
            fb_link: req.body.fb_link || null,
            insta_link: req.body.insta_link || null
        })

        return res.status(200).send()
    } catch (error) {
        return res.status(500).send(error)
    }
})

// router.delete('/deleteContact/:cu_id', async(req,res) => {
//     try {
//         await db('tbl_contact_us').where('cu_id', req.params.cu_id).delete()
//          return res.status(200).send()
//     } catch (error) {
//         return res.status(500).send(error)
//     }
// })

router.get('/getContact', async (req, res) => {
    const [contact] = await db('tbl_contact_us').select('*').limit(1);
    return res.status(200).send(contact);
});

module.exports = router