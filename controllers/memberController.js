const prisma = require('../lib/prisma');

exports.getMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany();
    res.render('members', { members });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก');
  }
};