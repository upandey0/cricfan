const SignupController = (req, res) => {
    try {
        const { email,password, isEligible } = req.body;
        if (!isEligible)
            return res.status(200).json({
                success: false,
                message: 'Age Must be 18 or above'
            })
        
        return res.status(200).json({
            success: true,
            message: "New User Created"
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message : 'Some Internal Error Occurred'
        })
    }
    
}

module.exports = {
    SignupController
}