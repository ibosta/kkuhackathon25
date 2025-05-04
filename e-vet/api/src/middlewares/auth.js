// Auth middleware'i devre dışı bırakın
module.exports = (req, res, next) => {
  // Token kontrolünü atlayarak her zaman erişime izin ver
  req.user = { id: 1, role: 'admin' }; // Varsayılan bir kullanıcı atayın
  next();
};