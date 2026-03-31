import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  PlusCircle, 
  History, 
  TrendingUp, 
  RefreshCcw,
  Smartphone,
  CreditCard
} from 'lucide-react';

function App() {
  const [transaction, setTransaction] = useState({ amount: "0", person: "Waiting...", type: "Paid", note: "" });
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalPaid: 0, totalReceived: 0, monthPaid: 0 });

  const fetchHistory = async () => {
    try {
      const res = await fetch('https://smart-note-gpay.onrender.com/api/get-transactions');
      const data = await res.json();
      setHistory(data);

      let paid = 0, received = 0, currentMonthPaid = 0;
      const currentMonth = new Date().getMonth();
      data.forEach(item => {
        const amt = parseFloat(item.amount);
        if (item.type === 'Paid') {
          paid += amt;
          if (new Date(item.date).getMonth() === currentMonth) currentMonthPaid += amt;
        } else received += amt;
      });
      setStats({ totalPaid: paid, totalReceived: received, monthPaid: currentMonthPaid });
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSave = async () => {
    if (!transaction.note || transaction.amount === "0") return alert("Details missing!");
    try {
      const res = await fetch('https://smart-note-gpay.onrender.com/api/save-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });
      if (res.ok) {
        setTransaction({ amount: "0", person: "Waiting...", type: "Paid", note: "" });
        fetchHistory();
      }
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      const res = await fetch(`https://smart-note-gpay.onrender.com/api/delete-transaction/${id}`, { method: 'DELETE' });
      if (res.ok) fetchHistory();
    }
  };

  const simulate = (type) => {
    const text = type === 'paid' ? "You paid ₹750 to Zomato" : "Received ₹1500 from Raja";
    const amt = text.match(/₹(\d+)/)[1];
    const name = type === 'paid' ? "Zomato" : "Raja";
    setTransaction({ amount: amt, person: name, type: type === 'paid' ? 'Paid' : 'Received', note: "" });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Wallet className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase text-slate-800">SmartNote</span>
          </div>
          <div className="hidden md:flex gap-4">
            <button onClick={() => simulate('paid')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">SIMULATE PAID</button>
            <button onClick={() => simulate('received')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">SIMULATE RECV</button>
          </div>
          <button onClick={fetchHistory} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <RefreshCcw className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        
        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Stats & Input (Lg: 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Wallet Card */}
            <div className="bg-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <p className="text-indigo-200 font-medium tracking-widest text-xs uppercase">Monthly Spending</p>
                  <TrendingUp className="text-indigo-300 opacity-50" />
                </div>
                <h2 className="text-5xl font-black mb-10 tracking-tighter">₹{stats.monthPaid}</h2>
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-indigo-300 text-[10px] uppercase font-bold tracking-widest">Lifetime Out</p>
                    <p className="text-lg font-bold">₹{stats.totalPaid}</p>
                  </div>
                  <div>
                    <p className="text-indigo-300 text-[10px] uppercase font-bold tracking-widest">Total In</p>
                    <p className="text-lg font-bold text-emerald-400">₹{stats.totalReceived}</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>

            {/* Quick Entry Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800">Quick Record</h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 text-center mb-6">
                <p className={`text-[10px] font-black uppercase mb-1 ${transaction.type === 'Paid' ? 'text-rose-500' : 'text-emerald-500'}`}>
                  Detected {transaction.type}
                </p>
                <h4 className="text-4xl font-black text-slate-800 tracking-tighter">₹{transaction.amount}</h4>
                <p className="text-slate-400 text-sm mt-1">From: <span className="text-indigo-600 font-bold">{transaction.person}</span></p>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-xl focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                  placeholder="Note: e.g., Lunch at office"
                  value={transaction.note}
                  onChange={(e) => setTransaction({...transaction, note: e.target.value})}
                />
                <button 
                  onClick={handleSave}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                >
                  Save Transaction
                </button>
              </div>
              
              {/* Mobile Only Simulation */}
              <div className="mt-4 flex gap-2 md:hidden">
                <button onClick={() => simulate('paid')} className="flex-1 bg-slate-100 text-[10px] font-bold p-2 rounded-lg text-slate-500">SIM PAID</button>
                <button onClick={() => simulate('received')} className="flex-1 bg-slate-100 text-[10px] font-bold p-2 rounded-lg text-slate-500">SIM RECV</button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: History (Lg: 7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden h-full">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800">Transaction History</h3>
                </div>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-widest">
                  {history.length} Total
                </span>
              </div>

              <div className="divide-y divide-slate-50 overflow-y-auto max-h-[700px]">
                {history.length > 0 ? history.map((item) => (
                  <div key={item._id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${item.type === 'Paid' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        {item.type === 'Paid' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[15px]">{item.note}</p>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tight flex items-center gap-1">
                          <CreditCard className="w-3 h-3" /> {item.person} • {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-3">
                      <p className={`font-black text-lg tracking-tighter ${item.type === 'Paid' ? 'text-slate-800' : 'text-emerald-600'}`}>
                        {item.type === 'Paid' ? '-' : '+'}₹{item.amount}
                      </p>
  
                      {/* Delete Button - Fixed for Mobile */}
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-rose-50 text-rose-500 rounded-lg active:bg-rose-100 transition-colors shadow-sm"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-20 text-center">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">No transactions recorded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;