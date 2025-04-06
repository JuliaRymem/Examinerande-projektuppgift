/* ANVÄNDA DENNA NYA KOD? */

/* middleware/validateUser.js
const validateUser = (req, res, next) => {
    const { name, email, password } = req.body;
  
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Namn måste anges.' });
    }
  
    if (!email || typeof email !== 'string' || email.trim() === '' || !email.includes('@')) {
      return res.status(400).json({ error: 'Ogiltig e-postadress.' });
    }
  
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Lösenordet måste vara minst 6 tecken långt.' });
    }
  
    next();
  };
  
  const validateUserId = (req, res, next) => {
    const userId = req.params.id;
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return res.status(400).json({ error: 'Användar-ID måste anges i URL:en.' });
    }
    next();
  };
  
  module.exports = { validateUser, validateUserId }; */