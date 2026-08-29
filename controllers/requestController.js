const prisma = require('../lib/prisma');

// show request
exports.getRequests = async (req, res) => {
  try {
    const requests = await prisma.roleChangeRequest.findMany();
    const decisions = await prisma.decision.findMany();

    const requestsWithVotes = requests.map(r => {
      const rDecisions = decisions.filter(d => d.requestId === r.id);
      return {
        ...r,
        approveCount: rDecisions.filter(d => d.result === 'APPROVE').length,
        rejectCount: rDecisions.filter(d => d.result === 'REJECT').length
      };
    });

    res.render('requests', { requests: requestsWithVotes });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลคำขอ');
  }
};

// สร้าง request
exports.createRequest = async (req, res) => {
  try {
    const { requesterId, targetId, newRole } = req.body;

    if (requesterId === targetId) {
      return res.status(400).send('ปฏิเสธ: ผู้เสนอไม่สามารถเสนอเปลี่ยน role ของตนเองได้');
    }

    const existingPending = await prisma.roleChangeRequest.findFirst({
      where: {
        targetId: targetId,
        status: 'PENDING'
      }
    });

    if (existingPending) {
      return res.status(400).send('ปฏิเสธ: สมาชิกเป้าหมายมีคำขอที่กำลังรอพิจารณาอยู่แล้ว');
    }

    await prisma.roleChangeRequest.create({
      data: {
        requesterId,
        targetId,
        newRole,
        status: 'PENDING'
      }
    });

    res.redirect('/members');
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการสร้างคำขอ');
  }
};

// โหวต request
exports.voteRequest = async (req, res) => {
  try {
    const { requestId, memberId, result } = req.body;

    const request = await prisma.roleChangeRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.status !== 'PENDING') {
      return res.status(400).send('ปฏิเสธ: คำขอนี้ไม่อยู่ในสถานะที่ลงความเห็นได้');
    }

    if (memberId === request.requesterId || memberId === request.targetId) {
      return res.status(400).send('ปฏิเสธ: ผู้เสนอและสมาชิกเป้าหมายไม่มีสิทธิ์ลงความเห็น');
    }

    const voter = await prisma.member.findUnique({ where: { id: memberId } });
    if (!voter || !voter.isActive) {
      return res.status(400).send('ปฏิเสธ: สมาชิกที่ไม่ได้ Active ไม่มีสิทธิ์ลงความเห็น');
    }

    const existingVote = await prisma.decision.findUnique({
      where: {
        requestId_memberId: { requestId, memberId }
      }
    });

    if (existingVote) {
      return res.status(400).send('ปฏิเสธ: คุณเคยลงความเห็นในคำขอนี้ไปแล้ว');
    }

    await prisma.decision.create({
      data: { requestId, memberId, result }
    });

    const votes = await prisma.decision.findMany({
      where: { requestId }
    });

    const approveCount = votes.filter(v => v.result === 'APPROVE').length;
    const rejectCount = votes.filter(v => v.result === 'REJECT').length;

    if (approveCount >= 2) {
      await prisma.roleChangeRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' }
      });

      await prisma.member.update({
        where: { id: request.targetId },
        data: { role: request.newRole }
      });

    } else if (rejectCount >= 2) {
      await prisma.roleChangeRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
      });
    }

    res.redirect('/members');
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการลงความเห็น');
  }
};

// ยกเลิก request
exports.cancelRequest = async (req, res) => {
  try {
    const { requestId, requesterId } = req.body;

    const request = await prisma.roleChangeRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.status !== 'PENDING') {
      return res.status(400).send('ปฏิเสธ: คำขอนี้ไม่อยู่ในสถานะที่สามารถยกเลิกได้');
    }

    if (request.requesterId !== requesterId) {
      return res.status(400).send('ปฏิเสธ: เฉพาะผู้เสนอเท่านั้นที่สามารถยกเลิกคำขอนี้ได้');
    }

    const votesCount = await prisma.decision.count({
      where: { requestId: requestId }
    });

    if (votesCount > 0) {
      return res.status(400).send('ปฏิเสธ: ไม่สามารถยกเลิกได้เนื่องจากมีสมาชิกลงความเห็นแล้ว');
    }

    await prisma.roleChangeRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' }
    });

    res.redirect('/members');
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการยกเลิกคำขอ');
  }
};