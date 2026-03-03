import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("titan_user")));
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentView, setCurrentView] = useState("dashboard"); 
  const [lang, setLang] = useState("TH");

  const [activeStaff, setActiveStaff] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]); 
  const [allAdjustments, setAllAdjustments] = useState([]); 
  const [approvedPercent, setApprovedPercent] = useState(0);
  
  const [adminLeaves, setAdminLeaves] = useState([]);
  const [adminAdjustments, setAdminAdjustments] = useState([]);
  const [adminTab, setAdminTab] = useState('leaves'); 

  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "ลาป่วย", startDate: "", startTime: "08:00", endDate: "", endTime: "17:00", reason: "" });
  const [calculatedTime, setCalculatedTime] = useState(null);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    tab: "swap", 
    oldDate: "", newDate: "",
    incidentDate: "", timeType: "เข้างาน (IN)", oldTime: "", newTime: "",
    reason: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const { data: attendance } = await supabase.from('attendance_logs').select('employee_id').gte('created_at', `${todayStr}T00:00:00`);
      setActiveStaff(new Set(attendance?.map(a => a.employee_id)).size || 0);

      const { data: leaves } = await supabase.from('leave_requests').select('*').eq('employee_id', user.id).order('created_at', { ascending: false });
      setAllLeaves(leaves || []);
      setPendingLeaves(leaves?.filter(l => l.status === 'รออนุมัติ').slice(0, 4) || []);

      const { data: adjusts } = await supabase.from('adjustment_requests').select('*').eq('employee_id', user.id).order('created_at', { ascending: false });
      setAllAdjustments(adjusts || []);

      const { data: balances } = await supabase.from('leave_balances').select('*').eq('employee_id', user.id);
      setLeaveBalances(balances || []);

      if (user.role === 'admin' || user.role === 'ceo') {
        const { data: allPendingLeaves } = await supabase.from('leave_requests').select(`*, employees(full_name, email)`).eq('status', 'รออนุมัติ').order('created_at', { ascending: false });
        setAdminLeaves(allPendingLeaves || []);

        const { data: allPendingAdjusts } = await supabase.from('adjustment_requests').select(`*, employees(full_name, email)`).eq('status', 'รออนุมัติ').order('created_at', { ascending: false });
        setAdminAdjustments(allPendingAdjusts || []);
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leave_requests').insert([{
        employee_id: user.id, leave_type: leaveForm.type, start_date: leaveForm.startDate, start_time: leaveForm.startTime,
        end_date: leaveForm.endDate, end_time: leaveForm.endTime, reason: leaveForm.reason, status: 'รออนุมัติ'
      }]);
      if (error) throw error;
      alert("ส่งคำขอลาหยุดเรียบร้อยแล้ว!");
      setIsLeaveModalOpen(false);
      fetchDashboardData();
    } catch (error) { alert("Error: " + error.message); } finally { setIsSubmitting(false); }
  };

  const handleSubmitAdjustment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const reqType = adjustForm.tab === 'swap' ? 'สลับวันหยุด' : 'แก้ไขเวลา';
      const payload = {
        employee_id: user.id, request_type: reqType, status: 'รออนุมัติ', reason: adjustForm.reason,
        old_date: adjustForm.tab === 'swap' ? adjustForm.oldDate : null, new_date: adjustForm.tab === 'swap' ? adjustForm.newDate : null,
        incident_date: adjustForm.tab === 'edit' ? adjustForm.incidentDate : null, time_type: adjustForm.tab === 'edit' ? adjustForm.timeType : null,
        old_time: adjustForm.tab === 'edit' ? adjustForm.oldTime : null, new_time: adjustForm.tab === 'edit' ? adjustForm.newTime : null,
      };

      const { error } = await supabase.from('adjustment_requests').insert([payload]);
      if (error) throw error;
      alert("ส่งคำขอปรับปรุงเรียบร้อยแล้ว!");
      setIsAdjustModalOpen(false);
      fetchDashboardData();
    } catch (error) { alert("Error: " + error.message); } finally { setIsSubmitting(false); }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#9333ea', color: 'white', padding: '20px' }}>
        <h2>PANCAKE ERP</h2>
        <p>{user?.full_name}</p>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setCurrentView("dashboard")}>หน้าแรก</button>
          <button onClick={() => setCurrentView("history")}>ข้อมูลการลา</button>
          <button onClick={() => setCurrentView("adjustments")}>แจ้งปรับปรุง</button>
          <button onClick={() => navigate('/check-in')}>ลงเวลา</button>
          {(user?.role === 'admin' || user?.role === 'ceo') && (
            <button onClick={() => setCurrentView("approvals")}>อนุมัติคำขอ</button>
          )}
          <button onClick={() => { localStorage.removeItem('titan_user'); navigate('/login'); }}>ออกจากระบบ</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>{currentView}</h2>
          <div>
            <button onClick={() => setIsLeaveModalOpen(true)} style={{ marginRight: '10px' }}>+ สร้างใหม่ (ลางาน)</button>
            <button onClick={() => setIsAdjustModalOpen(true)}>🛠️ แจ้งปรับปรุงเวลา</button>
          </div>
        </div>

        {currentView === "dashboard" && (
          <div>
            <h3>สถิติเบื้องต้น</h3>
            <p>พนักงานเข้างานวันนี้: {activeStaff}</p>
            {/* โครงสร้าง Dashboard เบื้องต้น */}
          </div>
        )}

        {currentView === "history" && (
          <div>
            <h3>ประวัติการลา</h3>
            <ul>
              {allLeaves.map(l => <li key={l.id}>{l.leave_type} - {l.status}</li>)}
            </ul>
          </div>
        )}

        {currentView === "adjustments" && (
          <div>
            <h3>ประวัติแจ้งปรับปรุง</h3>
            <ul>
              {allAdjustments.map(a => <li key={a.id}>{a.request_type} - {a.status}</li>)}
            </ul>
          </div>
        )}

      </div>

      {/* Modal ลางาน */}
      {isLeaveModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px' }}>
            <h3>ยื่นคำขอลา</h3>
            <form onSubmit={handleSubmitLeave}>
              {/* ฟอร์มขอลาย่อ */}
              <button type="submit">ส่งคำขอ</button>
              <button type="button" onClick={() => setIsLeaveModalOpen(false)}>ยกเลิก</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal แจ้งปรับปรุง */}
      {isAdjustModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px' }}>
            <h3>คำขอปรับปรุง</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button onClick={() => setAdjustForm({...adjustForm, tab: 'swap'})}>สลับวันหยุด</button>
              <button onClick={() => setAdjustForm({...adjustForm, tab: 'edit'})}>แก้ไขเวลา</button>
            </div>
            <form onSubmit={handleSubmitAdjustment}>
              {adjustForm.tab === 'swap' && (
                <div>
                  <p>วันหยุดเดิม: <input type="date" onChange={e => setAdjustForm({...adjustForm, oldDate: e.target.value})} /></p>
                  <p>วันหยุดใหม่: <input type="date" onChange={e => setAdjustForm({...adjustForm, newDate: e.target.value})} /></p>
                </div>
              )}
              {adjustForm.tab === 'edit' && (
                <div>
                   <p>วันที่เกิดเหตุ: <input type="date" onChange={e => setAdjustForm({...adjustForm, incidentDate: e.target.value})} /></p>
                   <p>เวลาเดิม: <input type="time" onChange={e => setAdjustForm({...adjustForm, oldTime: e.target.value})} /></p>
                   <p>เวลาที่ถูก: <input type="time" onChange={e => setAdjustForm({...adjustForm, newTime: e.target.value})} /></p>
                </div>
              )}
              <p>เหตุผล: <textarea onChange={e => setAdjustForm({...adjustForm, reason: e.target.value})}></textarea></p>
              <button type="submit">ส่งคำขอ</button>
              <button type="button" onClick={() => setIsAdjustModalOpen(false)}>ยกเลิก</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}