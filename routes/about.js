const db = require('../db/dbConfig.js')
const express = require('express')
const {checkAuth} = require('../auth');
const router = express.Router()

// router.post('/addAbout', async(req,res) => {
//     try {
//         const [addAbout] = await db('tbl_about_us').insert({
//             desc_en: req.body.desc_en,
//             desc_ku: req.body.desc_ku,
//             desc_ar: req.body.desc_ar
//         })

//         return res.status(200).send()
//     } catch (error) {
//         return res.status(500).send(error)
//     }
// })

router.patch('/updateAbout/:au_id', checkAuth, async(req,res) => {
    try {
        await db('tbl_about_us').where('au_id', req.params.au_id).update({
            desc_en: req.body.desc_en,
            desc_ku: req.body.desc_ku,
            desc_ar: req.body.desc_ar
        })

        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).send(error)
    }
})

// router.delete('/deleteAbout', async(req,res) => {
//     try {
//         await db('tbl_about_us').where('au_id', req.params.au_id).delete()
//          return res.status(200).send()
//     } catch (error) {
//         return res.status(500).send(error)
//     }
// })

router.get('/getOneAbout', async(req,res) => {
    try {
        const [getOneAbout] = await db('tbl_about_us').select("*").limit(1)
        return res.status(200).send(getOneAbout)
    } catch (error) {
        return res.status(500).send(error)
    }
})

module.exports = router