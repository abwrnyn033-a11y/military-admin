const express = require('express');
const router = express.Router();
// عدّل مسار الاستيراد حسب مكان موديل Person في مشروعك
const Person = require('../models/Person'); // مثال: Mongoose model

// Middleware افتراضي للتوثيق يفترض أن req.user موجود.
// إذا لديك middleware آخر لا تضع هذا، فقط تأكد req.user يحتوي على { role, platoon }.
// Example roles (بالعربي): 'مختص', 'القائد', 'البشرية'

/**
 * GET /api/persons?platoon=1
 * - إذا كان الدور 'مختص' => يرجع فقط الأشخاص من كتّبته (req.user.platoon)
 * - إذا كان الدور 'القائد' أو 'البشرية' => يرجع الكل (مع إمكانية فلترة بـ ?platoon=)
 */
router.get('/', async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    // لو المستخدم مختص => فقط كتّبته
    if (user.role === 'مختص') {
      if (!user.platoon) {
        return res.status(400).json({ message: 'User platoon not found' });
      }
      const persons = await Person.find({ platoon: user.platoon }).lean();
      return res.json(persons);
    }

    // إذا القائد أو البشرية => إرجاع كل السجلات (مع فلترة إن أعطى الاستعلام platoon=)
    if (user.role === 'القائد' || user.role === 'البشرية') {
      const { platoon } = req.query;
      const filter = {};
      if (platoon) filter.platoon = platoon;
      const persons = await Person.find(filter).lean();
      return res.json(persons);
    }

    // افتراضي: رفض الوصول للأدوار الأخرى
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  } catch (err) {
    console.error('GET /api/persons error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
