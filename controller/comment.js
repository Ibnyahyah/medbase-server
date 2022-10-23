import Comment from '../model/comment.js';
import Record from '../model/patient.js'

export const getCommentPost = async (req, res) => {
    try {
        const currentUser = await Record.findById(req.params.id);
        const userPosts = await Comment.find({ recordId: currentUser._id });


        res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json(err);
    }
};


export const commentPost = async (req, res) => {

    const { id } = req.params;

    if (req.body.recordId === id) {
        try {
            const content = new Comment(req.body);

            const savedContent = await content.save()

            res.status(200).json(savedContent);
        } catch (error) {
            res.status(404).json({ error: error.message });
            console.log(error)
        }
    } else {
        console.log('Invalid Id')
    }
};