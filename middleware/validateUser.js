// Middleware för att validera användardata vid registrering och uppdatering av användare  
const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Namn måste anges.' });
  }
  if (!email || typeof email !== 'string' || email.trim() === '' || !email.includes('@')) {
    return res.status(400).json({ error: 'Ogiltig e-postadress.' });
  }
  if (!password || typeof password !== 'string' || password.length < 10) {
    return res.status(400).json({ error: 'Lösenordet måste vara minst 10 tecken långt.' });
  }
  next();
};

// Middleware för att validera användar-ID vid uppdatering och borttagning av användare 
const validateUserId = (req, res, next) => {
  const userId = req.params.id;
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return res.status(400).json({ error: 'Användar-ID måste anges i URL:en.' });
  }
  next();
};

// Exportera middleware-funktionerna så att de kan användas i andra delar av applikationen 
module.exports = { validateUser, validateUserId };
