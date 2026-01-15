// 自定义弹窗管理系统
class ModalManager {
    constructor() {
        this.currentModal = null;
        this.modalContainer = document.getElementById('modalContainer');
        this.init();
    }
    
    // 初始化
    init() {
        // 点击背景关闭弹窗
        this.modalContainer?.addEventListener('click', (e) => {
            if (e.target === this.modalContainer) {
                this.closeCurrentModal();
            }
        });
        
        // ESC键关闭弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeCurrentModal();
            }
        });
    }
    
    // 显示弹窗
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // 关闭当前弹窗
        this.closeCurrentModal();
        
        // 显示新弹窗
        this.modalContainer.classList.add('show');
        modal.classList.add('show');
        this.currentModal = modal;
        
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭弹窗
    closeModal(modalId) {
        const modal = modalId ? document.getElementById(modalId) : this.currentModal;
        if (!modal) return;
        
        modal.classList.remove('show');
        
        // 检查是否还有其他弹窗打开
        const openModals = this.modalContainer.querySelectorAll('.modal.show');
        if (openModals.length === 0) {
            this.modalContainer.classList.remove('show');
            document.body.style.overflow = '';
        }
        
        if (modal === this.currentModal) {
            this.currentModal = null;
        }
    }
    
    // 关闭当前弹窗
    closeCurrentModal() {
        if (this.currentModal) {
            this.closeModal(this.currentModal.id);
        }
    }
    
    // 显示提示弹窗
    showAlert(message, title = '提示') {
        document.getElementById('alertTitle').textContent = title;
        document.getElementById('alertMessage').textContent = message;
        this.showModal('alertModal');
    }
    
    // 显示成功弹窗
    showSuccess(message, title = '操作成功') {
        document.getElementById('successTitle').textContent = title;
        document.getElementById('successMessage').textContent = message;
        this.showModal('successModal');
    }
}

// 创建全局弹窗管理器实例
const modalManager = new ModalManager();

// 全局函数（供HTML调用）
function showModal(modalId) {
    modalManager.showModal(modalId);
}

function closeModal(modalId) {
    modalManager.closeModal(modalId);
}

function showAlert(message, title) {
    modalManager.showAlert(message, title);
}

function showSuccess(message, title) {
    modalManager.showSuccess(message, title);
}

// 显示举报弹窗
function showReportModal() {
    // 清空表单
    document.getElementById('reportType').value = '';
    document.getElementById('reportContent').value = '';
    document.getElementById('reportContact').value = '';
    
    modalManager.showModal('reportModal');
}

// 提交举报
function submitReport() {
    const type = document.getElementById('reportType').value;
    const content = document.getElementById('reportContent').value.trim();
    const contact = document.getElementById('reportContact').value.trim();
    
    // 验证表单
    if (!type) {
        modalManager.showAlert('请选择问题类型');
        return;
    }
    
    if (!content) {
        modalManager.showAlert('请输入反馈内容');
        return;
    }
    
    if (content.length < 10) {
        modalManager.showAlert('反馈内容至少需要10个字符');
        return;
    }
    
    // 保存反馈到本地存储（实际应用中应该发送到服务器）
    const reportData = {
        type: type,
        content: content,
        contact: contact,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // 获取现有的反馈记录
    let reports = [];
    try {
        const savedReports = localStorage.getItem('userReports');
        if (savedReports) {
            reports = JSON.parse(savedReports);
        }
    } catch (e) {
        console.error('Failed to load reports:', e);
    }
    
    // 添加新反馈
    reports.push(reportData);
    
    // 保存到本地存储
    try {
        localStorage.setItem('userReports', JSON.stringify(reports));
        console.log('Report saved:', reportData);
    } catch (e) {
        console.error('Failed to save report:', e);
    }
    
    // 关闭反馈弹窗
    modalManager.closeModal('reportModal');
    
    // 显示成功提示
    setTimeout(() => {
        modalManager.showSuccess(
            '感谢您的反馈！我们会认真处理您的意见。',
            '提交成功'
        );
    }, 300);
    
    // 3秒后自动关闭成功提示
    setTimeout(() => {
        modalManager.closeModal('successModal');
    }, 3300);
}

// 查看所有反馈（开发者功能）
function viewAllReports() {
    try {
        const reports = localStorage.getItem('userReports');
        if (reports) {
            const reportList = JSON.parse(reports);
            console.log('All Reports:', reportList);
            return reportList;
        }
    } catch (e) {
        console.error('Failed to load reports:', e);
    }
    return [];
}

// 清除所有反馈（开发者功能）
function clearAllReports() {
    if (confirm('确定要清除所有反馈记录吗？')) {
        localStorage.removeItem('userReports');
        console.log('All reports cleared');
    }
}
