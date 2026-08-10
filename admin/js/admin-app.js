/**
 * SAPMAZ ACADEMY - ADMINISTRATIVE PANEL CONTROLLER
 * Single Page Application (SPA) State Manager & UI Controller
 * Includes Complete Bi-lingual (Turkish 🇹🇷 / English 🇬🇧) Internationalization (i18n) Engine
 * Full Multi-Column Filtering System for Applications, Contacts, Courses, News & Resource Pool Files
 * Automatic File Metadata Extraction (Format & Size calculated from file data)
 */

class AdminApp {
  constructor() {
    this.storage = new GitContentStorage();
    this.currentView = 'overview';
    this.lang = localStorage.getItem('sapmaz_admin_lang') || 'tr';
    this.activeDrawer = null;
    this.activeModal = null;
    this.editingCourseId = null;
    this.editingNewsId = null;
    this.editingResourceId = null;
    this.activeAppId = null;
    this.activeContactId = null;

    // Multi-Column Filter State for all 5 Tables
    this.columnFilters = {
      applications: {},
      contacts: {},
      courses: {},
      news: {},
      resources: {}
    };

    // Quick Content Management Widget Pagination State
    this.quickCoursePage = 1;
    this.quickNewsPage = 1;
    this.quickResourcePage = 1;
    this.quickItemsPerPage = 4;

    this.translations = {
      // Navigation & Header
      "nav_dashboard": { tr: "📌 Genel Bakış", en: "📌 Dashboard Overview" },
      "nav_applications": { tr: "📥 Kurs Başvuruları", en: "📥 Course Applications" },
      "nav_contacts": { tr: "💬 İletişim Formları", en: "💬 Contact Inquiries" },
      "nav_courses": { tr: "📚 Kurs Listesi", en: "📚 Course Listings" },
      "nav_news": { tr: "📰 Haberler & Duyurular", en: "📰 News & Articles" },
      "nav_resources_admin": { tr: "📁 Kaynak Dosyaları", en: "📁 Resource Pool Files" },
      "nav_settings": { tr: "⚙️ Sistem Ayarları", en: "⚙️ System Settings" },
      "group_inboxes": { tr: "GELEN KUTULARI", en: "INBOXES" },
      "group_content": { tr: "İÇERİK YÖNETİMİ", en: "CONTENT MANAGEMENT" },
      "group_system": { tr: "SİSTEM", en: "SYSTEM" },
      "notif_header": { tr: "Sistem Bildirimleri", en: "System Notifications" },
      "notif_live": { tr: "Canlı", en: "Live" },
      "notif_app_title": { tr: "📥 Yeni Kurs Başvurusu Alındı", en: "📥 New Course Application Received" },
      "notif_app_desc": { tr: "Hasan Caner, İHA-1 Ticari Pilot Eğitimi için başvurdu.", en: "Hasan Caner applied for İHA-1 Commercial Certification." },
      "notif_cnt_title": { tr: "💬 Okunmamış İletişim Mesajı", en: "💬 Unread Contact Form Message" },
      "notif_cnt_desc": { tr: "Serkan Öztürk (TechCorp) kurumsal teklif istedi.", en: "Serkan Öztürk (TechCorp) requested corporate group quote." },
      "search_placeholder": { tr: "Başvuran, iletişim, kurs, haber, kaynak ara...", en: "Search applicants, contacts, courses, news, resources..." },

      // Dashboard Overview
      "dash_title": { tr: "GENEL BAKIŞ PANELİ", en: "DASHBOARD OVERVIEW" },
      "dash_desc": { tr: "Sapmaz UAV Academy Yönetim Paneli ve Anlık Sistem Özeti", en: "Sapmaz UAV Academy Admin Panel & Live System Overview" },
      "btn_new_course": { tr: "+ Yeni Kurs", en: "+ New Course" },
      "btn_new_news": { tr: "+ Yeni Haber", en: "+ New News" },
      "btn_new_resource": { tr: "+ Yeni Kaynak", en: "+ New Resource" },
      "stat_new_apps": { tr: "Yeni Başvurular", en: "New Applications" },
      "stat_unread_cnt": { tr: "Okunmamış Mesajlar", en: "Unread Inquiries" },
      "stat_active_courses": { tr: "Aktif Kurslar", en: "Active Courses" },
      "stat_drafts": { tr: "Taslak İçerikler", en: "Draft Content" },
      "tag_inquiry_queue": { tr: "Başvuru Kuyruğu", en: "Inquiry Queue" },
      "tag_urgent": { tr: "Acil İşlem", en: "Urgent Action" },
      "tag_clear": { tr: "Temiz", en: "Clear" },
      "tag_web_inquiries": { tr: "Web Form Talepleri", en: "Web Form Inquiries" },
      "tag_action_needed": { tr: "İşlem Bekliyor", en: "Action Needed" },
      "tag_all_read": { tr: "Tümü Okundu", en: "All Read" },
      "tag_published_progs": { tr: "Yayınlanan Programlar", en: "Published Programs" },
      "tag_shgm_cert": { tr: "SHGM Onaylı", en: "SHGM Certified" },
      "tag_unpublished": { tr: "Yayınlanmamış İçerik", en: "Unpublished Content" },
      "tag_in_review": { tr: "İncelemede", en: "In Review" },
      "recent_apps_title": { tr: "📥 Son Kurs Başvuruları", en: "📥 Recent Course Applications" },
      "unread_cnt_title": { tr: "💬 Okunmamış İletişim Mesajları", en: "💬 Unread Contact Inquiries" },
      "quick_content_title": { tr: "⚡ Hızlı İçerik Yönetimi", en: "⚡ Quick Content Management" },
      "active_courses_sub": { tr: "Aktif Yayınlanan Kurslar", en: "Active Course Listings" },
      "recent_news_sub": { tr: "Son Haberler & Duyurular", en: "Recent News & Articles" },
      "recent_resources_sub": { tr: "Kaynak Dosyaları & Belgeler", en: "Resource Pool Files & Docs" },
      "view_all": { tr: "Tümünü Gör", en: "View All" },
      "view_details": { tr: "Detayları Gör", en: "View Details" },
      "edit": { tr: "Düzenle", en: "Edit" },
      "print": { tr: "Yazdır", en: "Print" },

      // Column Filter & Table Actions
      "btn_clear_filters": { tr: "✕ Filtreleri Temizle", en: "✕ Clear Filters" },
      "filter_all": { tr: "Tümü (All)", en: "All" },
      "filter_search": { tr: "Filtrele...", en: "Filter..." },
      "lbl_filtered_count": { tr: "Filtrelenen Kayıt:", en: "Filtered Records:" },

      // Table Columns
      "col_applicant": { tr: "Başvuran", en: "Applicant" },
      "col_course": { tr: "Eğitim", en: "Course" },
      "col_date": { tr: "Tarih", en: "Date" },
      "col_status": { tr: "Durum", en: "Status" },
      "col_action": { tr: "İşlem", en: "Action" },
      "col_from": { tr: "Gönderen", en: "From" },
      "col_subject": { tr: "Konu", en: "Subject" },
      "col_priority": { tr: "Öncelik", en: "Priority" },
      "col_title": { tr: "Başlık", en: "Title" },
      "col_category": { tr: "Kategori", en: "Category" },
      "col_duration": { tr: "Süre", en: "Duration" },
      "col_fee": { tr: "Ücret", en: "Fee" },
      "col_next_start": { tr: "Gelecek Başlangıç", en: "Next Start" },
      "col_author": { tr: "Yazar", en: "Author" },
      "col_format": { tr: "Format", en: "Format" },
      "col_size": { tr: "Boyut", en: "Size" },

      // Status Labels
      "status_New": { tr: "Yeni", en: "New" },
      "status_Pending Review": { tr: "İncelemede", en: "Pending Review" },
      "status_Approved": { tr: "Onaylandı", en: "Approved" },
      "status_Rejected": { tr: "Reddedildi", en: "Rejected" },
      "status_Unread": { tr: "Okunmadı", en: "Unread" },
      "status_Read": { tr: "Okundu", en: "Read" },
      "status_Resolved": { tr: "Çözüldü", en: "Resolved" },
      "status_Published": { tr: "Yayında", en: "Published" },
      "status_Draft": { tr: "Taslak", en: "Draft" },

      // Application & Contact Drawers
      "drawer_app_title": { tr: "Başvuru Detay Formu", en: "Application Detail Form" },
      "drawer_cnt_title": { tr: "İletişim Detay Formu", en: "Contact Detail Form" },
      "block_status": { tr: "Mevcut Durum", en: "Current Status" },
      "block_applicant_info": { tr: "Başvuran Bilgileri", en: "Applicant Information" },
      "block_course_info": { tr: "Eğitim Detayları", en: "Target Course Details" },
      "block_experience": { tr: "Uçuş Deneyimi & Notlar", en: "Prior Flight Experience & Notes" },
      "block_notes": { tr: "Dahili Personel Notları", en: "Internal Staff Notes" },
      "block_comm": { tr: "İletişim & İşlem Çubuğu", en: "Communication & Action Bar" },
      "lbl_full_name": { tr: "Ad Soyad", en: "Full Name" },
      "lbl_email": { tr: "E-Posta Adresi", en: "Email Address" },
      "lbl_phone": { tr: "Telefon Numarası", en: "Phone Number" },
      "lbl_submission_date": { tr: "Başvuru Tarihi", en: "Submission Date" },
      "lbl_id_address": { tr: "T.C. Kimlik / Adres", en: "T.C. ID / Address" },
      "lbl_course_name": { tr: "Eğitim Adı", en: "Course Name" },
      "lbl_schedule": { tr: "Dönem / Takvim", en: "Cohort / Schedule" },
      "lbl_fee": { tr: "Eğitim Ücreti", en: "Tuition Fee" },
      "lbl_attached_files": { tr: "Ekli Belgeler", en: "Attached Documents" },
      "lbl_not_specified": { tr: "Belirtilmedi", en: "Not specified" },
      "lbl_no_docs": { tr: "Evrak eklenmedi.", en: "No documents attached." },
      "placeholder_staff_note": { tr: "Personel notu ekleyin...", en: "Add internal staff note..." },
      "btn_add_note": { tr: "Not Ekle", en: "Add Note" },
      "lbl_select_email_template": { tr: "E-Posta Şablonu Seçin", en: "Select Preset Email Template" },
      "opt_select_template": { tr: "Şablon Seçiniz...", en: "Select Template..." },
      "opt_acceptance_letter": { tr: "Kabul Mektubu Gönder", en: "Send Acceptance Letter" },
      "opt_request_missing": { tr: "Eksik Evrak Talep Et", en: "Request Missing Docs" },
      "placeholder_email_body": { tr: "E-posta mesaj önizlemesi...", en: "Email message preview..." },
      "btn_send_email": { tr: "E-Posta Gönder", en: "Send Email" },

      // Contact Drawer Reply Section
      "block_message_body": { tr: "Mesaj İçeriği", en: "Message Body" },
      "block_quick_reply": { tr: "Hızlı Yanıt Bölümü", en: "Quick Reply Section" },
      "opt_reply_general": { tr: "Genel Bilgilendirme Yanıtı", en: "General Information Reply" },
      "opt_reply_corporate": { tr: "Kurumsal Grup Teklifi Yanıtı", en: "Corporate Group Offer Reply" },
      "placeholder_reply_body": { tr: "Düzenlenebilir yanıt e-postası...", en: "Editable reply email body..." },
      "btn_attach_file": { tr: "📎 Dosya Ekle", en: "📎 Attach File" },
      "btn_reply_archive": { tr: "Yanıtla & Arşivle", en: "Send Reply & Archive" },

      // Course Editor Form
      "title_edit_course": { tr: "Kurs İlanını Düzenle", en: "Edit Course Listing" },
      "title_create_course": { tr: "Yeni Kurs İlanı Oluştur", en: "Create New Course Listing" },
      "btn_back_courses": { tr: "‹ Kurs Listesine Dön", en: "‹ Back to Course Listings" },
      "sec_basic_info": { tr: "1. Temel Bilgiler Bölümü", en: "1. Basic Information Section" },
      "lbl_course_title": { tr: "Kurs Başlığı *", en: "Course Title *" },
      "lbl_course_category": { tr: "Kurs Kategorisi *", en: "Course Category *" },
      "lbl_course_status": { tr: "Yayın Durumu", en: "Course Status" },
      "lbl_course_excerpt": { tr: "Kısa Özet (Kart görünümü önizleme metni)", en: "Short Excerpt (Preview text for card view)" },
      "sec_logistics": { tr: "2. Kurs Detayları & Lojistik Bölümü", en: "2. Course Details & Logistics Section" },
      "lbl_duration": { tr: "Süre", en: "Duration" },
      "lbl_capacity": { tr: "Kontenjan Kapasitesi", en: "Class Capacity" },
      "lbl_tuition_fee": { tr: "Eğitim Ücreti", en: "Tuition Fee" },
      "lbl_next_start_date": { tr: "Gelecek Başlangıç Tarihi", en: "Next Start Date" },
      "sec_syllabus": { tr: "3. Müfredat & Genel Bakış Bölümü", en: "3. Course Overview & Syllabus Section" },
      "sec_media": { tr: "4. Medya & Dosya Ekleri Bölümü", en: "4. Media & Document Attachments Section" },
      "drop_course_media": { tr: "Broşür, müfredat PDF veya kapak görselini buraya sürükleyip bırakın", en: "Drag & drop course brochures, syllabus PDFs or header images here" },

      // News Editor Form
      "title_edit_news": { tr: "Haber / Duyuru Düzenle", en: "Edit News Article" },
      "title_create_news": { tr: "Yeni Haber / Duyuru Oluştur", en: "Create New News Article" },
      "btn_back_news": { tr: "‹ Haber Listesine Dön", en: "‹ Back to News & Posts" },
      "sec_article_details": { tr: "1. Makale Detayları Bölümü", en: "1. Article Details Section" },
      "lbl_article_title": { tr: "Haber Başlığı *", en: "Article Title *" },
      "lbl_site_category": { tr: "Kategori (Site Kategorileri) *", en: "Category (Site Categories) *" },
      "lbl_author": { tr: "Yazar / Yetkili", en: "Author / Staff Member" },
      "lbl_publish_date": { tr: "Yayın Tarihi", en: "Publish Date" },
      "lbl_article_status": { tr: "Yayın Durumu", en: "Article Status" },
      "sec_article_summary": { tr: "2. Özet & Spot Metin Bölümü", en: "2. Summary & Excerpt Section" },
      "lbl_summary_desc": { tr: "Spot Özet (Arama sonuçlarında ve ana sayfada görünür)", en: "Summary / Excerpt (Used in search results & homepage previews)" },
      "sec_article_body": { tr: "3. Makale İçeriği Bölümü", en: "3. Article Body Section" },
      "sec_cover_image": { tr: "4. Öne Çıkan Kapak Görseli Bölümü", en: "4. Featured Cover Image Section" },
      "drop_news_cover": { tr: "Kapak görselini seçmek için tıklayın veya sürükleyin", en: "Click or drop featured cover image here" },

      // Resource Editor Form & Auto-Detection Metadata
      "title_edit_resource": { tr: "Kaynak Dokümanını Düzenle", en: "Edit Resource Document" },
      "title_create_resource": { tr: "Yeni Kaynak Dosyası Ekle", en: "Add New Resource File" },
      "btn_back_resources": { tr: "‹ Kaynak Listesine Dön", en: "‹ Back to Resource Pool Files" },
      "sec_resource_ident": { tr: "1. Kaynak Tanımlama Bölümü", en: "1. Resource Identification Section" },
      "lbl_res_title_tr": { tr: "Kaynak Başlığı (Türkçe) *", en: "Resource Title (Turkish) *" },
      "lbl_res_title_en": { tr: "Kaynak Başlığı (İngilizce)", en: "Resource Title (English)" },
      "lbl_target_tab": { tr: "Hedef Kategori (Site Sekmesi) *", en: "Target Category (Site Tab) *" },
      "lbl_auto_format": { tr: "Otomatik Algılanan Format", en: "Auto-Detected Format" },
      "lbl_auto_size": { tr: "Otomatik Algılanan Dosya Boyutu", en: "Auto-Detected File Size" },
      "lbl_file_url": { tr: "Dosya Yolu / İndirme Bağlantısı", en: "File Path / Download URL" },
      "sec_res_desc": { tr: "2. Açıklama & SSS Yanıt Metni Bölümü", en: "2. Resource Description / Answer Body Section" },
      "lbl_res_desc_text": { tr: "Özet Açıklama veya SSS Yanıt Metni", en: "Summary Description or FAQ Answer Text" },
      "sec_res_drop": { tr: "3. Dosya Yükleme Alanı (Format & Boyut Otomatik Hesaplanır)", en: "3. File Attachment Dropzone (Format & Size Auto-Extracted)" },
      "drop_res_file": { tr: "PDF veya ZIP kaynak dosyasını seçin (Format & Boyut otomatik okunur)", en: "Select PDF/ZIP resource file (Format & Size auto-extracted)" },

      // Settings Screen
      "sec_storage_engine": { tr: "Depolama & GitHub API Motoru Yapılandırması", en: "Storage & GitHub API Engine Config" },
      "lbl_storage_mode": { tr: "Depolama Modu", en: "Storage Mode" },
      "mode_local": { tr: "Yerel Test Depolama Modu (LocalStorage)", en: "Local Storage Test Mode" },
      "mode_github": { tr: "Canlı GitHub API Modu", en: "GitHub Live API Mode" },
      "lbl_git_token": { tr: "GitHub Kişisel Erişim Jetonu (Token - Doğrudan git commit için)", en: "GitHub Personal Access Token (Optional for direct git commits)" },
      "btn_save_config": { tr: "Yapılandırmayı Kaydet", en: "Save Configuration" },

      // Generic Actions & Modals
      "btn_cancel": { tr: "İptal", en: "Cancel" },
      "btn_save_draft": { tr: "Taslak Olarak Kaydet", en: "Save as Draft" },
      "btn_save_publish": { tr: "Kaydet & Yayınla", en: "Save & Publish" },
      "btn_delete_course": { tr: "🗑️ Kursu Sil", en: "🗑️ Delete Course" },
      "btn_delete_article": { tr: "🗑️ Haberi Sil", en: "🗑️ Delete Article" },
      "btn_delete_resource": { tr: "🗑️ Kaynak Dosyasını Sil", en: "🗑️ Delete Resource File" },
      "btn_confirm_delete": { tr: "Silmeyi Onayla", en: "Confirm Delete" },
      "modal_sure": { tr: "Emin misiniz?", en: "Are you sure?" },
      "modal_undone": { tr: "Bu işlem geri alınamaz.", en: "This action cannot be undone." }
    };

    this.init();
  }

  t(key) {
    if (this.translations[key]) {
      return this.translations[key][this.lang] || this.translations[key]['tr'] || key;
    }
    return key;
  }

  toggleLanguage() {
    this.lang = this.lang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('sapmaz_admin_lang', this.lang);
    this.updateLanguageUI();
    this.renderCurrentView();
  }

  updateLanguageUI() {
    const flag = document.getElementById('langFlag');
    const label = document.getElementById('langLabel');
    if (flag && label) {
      if (this.lang === 'tr') {
        flag.textContent = '🇹🇷';
        label.textContent = 'TR';
      } else {
        flag.textContent = '🇬🇧';
        label.textContent = 'EN';
      }
    }

    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.placeholder = this.t('search_placeholder');
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && this.translations[key]) {
        el.textContent = this.t(key);
      }
    });
  }

  async init() {
    await this.seedInitialDataIfEmpty();
    this.bindEvents();
    this.updateLanguageUI();
    this.renderCurrentView();
    this.updateNotificationBadges();
  }

  // Set individual column filter value
  setColumnFilter(view, field, value) {
    if (!this.columnFilters[view]) this.columnFilters[view] = {};
    if (value && value.trim() !== '' && value !== 'ALL') {
      this.columnFilters[view][field] = value.trim();
    } else {
      delete this.columnFilters[view][field];
    }
    this.renderCurrentView();
  }

  // Clear all filters for a view
  clearColumnFilters(view) {
    this.columnFilters[view] = {};
    this.renderCurrentView();
  }

  async seedInitialDataIfEmpty() {
    // --- COURSES ---
    let courses = await this.storage.listCollection('courses');
    if (!courses || courses.length === 0) {
      const initialCourses = [
        {
          id: 'iha-0-basic',
          titleTR: 'İHA-0 — Temel Drone Ehliyeti',
          category: 'İHA-0 (Temel Drone Ehliyeti)',
          duration: '2 Gün / 12 Saat',
          capacity: 20,
          fee: '₺4.500',
          nextDate: '2026-09-05',
          status: 'Published',
          excerpt: '500 gram – 4 kg arası hobi ve ticari amaçlı küçük drone\'lar için temel uçuş lisansı.',
          description: '<p>SHGM onaylı İHA-0 eğitimi ile 500 gram ve 4 kg arasındaki tüm insansız hava araçlarını yasal olarak uçurma yetkisi kazanın.</p>'
        },
        {
          id: 'iha-1-commercial',
          titleTR: 'İHA-1 — Orta Sınıf Drone Ehliyeti',
          category: 'İHA-1 (Orta Sınıf Drone Ehliyeti)',
          duration: '3 Gün / 36 Saat',
          capacity: 25,
          fee: '₺14.500',
          nextDate: '2026-09-01',
          status: 'Published',
          excerpt: '4 kg – 25 kg arası ticari ve profesyonel drone operasyonları için orta düzey lisans programı.',
          description: '<p>İHA-1 ticari lisansı ile Haritacılık, Sinematografi, Arama Kurtarma ve Tarım sektörlerinde profesyonel İHA pilotu olarak görev yapın.</p>'
        },
        {
          id: 'iha-2-heavy',
          titleTR: 'İHA-2 — Büyük İHA Ehliyeti',
          category: 'İHA-2 (Büyük İHA Ehliyeti)',
          duration: '5 Gün / 90 Saat',
          capacity: 15,
          fee: '₺32.000',
          nextDate: '2026-09-15',
          status: 'Published',
          excerpt: '25 kg – 150 kg arası endüstriyel ölçekli insansız hava araçları için ileri düzey lisans.',
          description: '<p>Endüstriyel ölçekli ağır İHA platformları, kargo drone\'ları ve haritalama araçları operasyonel sertifikasyon eğitimi.</p>'
        },
        {
          id: 'iha-3-advanced',
          titleTR: 'İHA-3 — İleri Endüstriyel Ehliyet',
          category: 'İHA-3 (İleri Endüstriyel Ehliyet)',
          duration: '10 Gün / 120 Saat',
          capacity: 10,
          fee: '₺45.000',
          nextDate: '2026-10-01',
          status: 'Published',
          excerpt: '150 kg ve üzeri askeri/endüstriyel büyük İHA operasyonları için ileri düzey lisans programı.',
          description: '<p>Stratejik İHA sistemleri operasyon ve bakım uzmanlığı sertifikasyon eğitimi.</p>'
        },
        {
          id: 'ppl-private-pilot',
          titleTR: 'PPL — Özel Pilot Lisansı',
          category: 'PPL (Özel Pilot Lisansı)',
          duration: '45 Saat Uçuş',
          capacity: 10,
          fee: '₺280.000',
          nextDate: '2026-09-10',
          status: 'Published',
          excerpt: 'Havacılık kariyerinizin ilk adımı. Özel uçuş lisansı ile gökyüzüne çıkın.',
          description: '<p>Sivil havacılık standartlarında tek motorlu uçaklar için hususi pilot lisansı teorik ve pratik eğitimi.</p>'
        },
        {
          id: 'atpl-airline-pilot',
          titleTR: 'ATPL — Havayolu Taşımacılık Pilotu',
          category: 'ATPL (Havayolu Taşımacılık Pilotu)',
          duration: '1500 Saat Uçuş',
          capacity: 8,
          fee: '₺950.000',
          nextDate: '2026-10-15',
          status: 'Published',
          excerpt: 'En yüksek seviye pilotluk lisansı. Havayolu kaptan pilotu olma yolunda ileri düzey eğitim.',
          description: '<p>Havayolu taşımacılığı pilot lisansı dondurulmuş (ATPL Frozen) ve kaptanlık eğitimi.</p>'
        },
        {
          id: 'cpl-commercial-pilot',
          titleTR: 'CPL — Ticari Pilot Lisansı',
          category: 'CPL (Ticari Pilot Lisansı)',
          duration: '200 Saat Uçuş',
          capacity: 12,
          fee: '₺550.000',
          nextDate: '2026-09-18',
          status: 'Published',
          excerpt: 'Profesyonel pilotluk kariyeriniz için gerekli ticari pilot sertifikası programı.',
          description: '<p>Ticari amaçlı havayolu ve genel havacılık operasyonlarında görev alabilmek için CPL eğitimi.</p>'
        },
        {
          id: 'nr-night-rating',
          titleTR: 'NR — Gece Yetkisi',
          category: 'NR (Gece Yetkisi)',
          duration: '5 Saat Uçuş',
          capacity: 15,
          fee: '₺45.000',
          nextDate: '2026-09-12',
          status: 'Published',
          excerpt: 'Gece şartlarında görerek emniyetle uçuş yapabilmek için gerekli ek yetki programı.',
          description: '<p>Gece görerek uçuş (VFR) yetkisi kazandıran teorik ve gece uçuş eğitimi.</p>'
        },
        {
          id: 'pic-time-building',
          titleTR: 'PIC — Sorumlu Pilot Uçuşu',
          category: 'PIC (Sorumlu Pilot Uçuşu)',
          duration: 'Saat Biriktirme',
          capacity: 20,
          fee: '₺3.800 / Saat',
          nextDate: 'Esnek',
          status: 'Published',
          excerpt: 'CPL lisansı ve aletli uçuş eğitimleri sürecinde sorumlu pilot saat biriktirme programı.',
          description: '<p>Filomuzdaki modern uçaklarla sorumlu pilot (Pilot in Command) saat doldurma uçuşları.</p>'
        },
        {
          id: 'ir-instrument-rating',
          titleTR: 'IR — Aletli Uçuş Yetkisi',
          category: 'IR (Aletli Uçuş Yetkisi)',
          duration: '50 Saat Uçuş',
          capacity: 10,
          fee: '₺190.000',
          nextDate: '2026-09-22',
          status: 'Published',
          excerpt: 'Bulut içi veya kısıtlı görüş şartlarında sadece kokpit göstergelerine güvenerek uçabilme yetkisi.',
          description: '<p>Aletli uçuş kurallarına (IFR) uygun olarak her türlü hava şartında emniyetle seyrüsefer eğitimi.</p>'
        },
        {
          id: 'me-multi-engine',
          titleTR: 'ME — Çok Motor Yetkisi',
          category: 'ME (Çok Motor Yetkisi)',
          duration: '6 Saat Uçuş',
          capacity: 8,
          fee: '₺85.000',
          nextDate: '2026-09-28',
          status: 'Published',
          excerpt: 'Birden fazla motora sahip uçakları sevk ve idare edebilmek için gerekli resmi uçuş lisans eğitimi.',
          description: '<p>Çift motorlu uçaklarda uçuş dinamiği, asimetrik motor yetmezliği ve seyrüsefer eğitimi.</p>'
        },
        {
          id: 'mcc-multi-crew',
          titleTR: 'MCC — Çoklu Mürettebat İşbirliği',
          category: 'MCC (Çoklu Mürettebat İşbirliği)',
          duration: '20 Saat Simülatör',
          capacity: 12,
          fee: '₺65.000',
          nextDate: '2026-10-05',
          status: 'Published',
          excerpt: 'Çok pilotlu kokpit operasyonlarında havayolu standartlarında işbirliği ve kaynak yönetimi eğitimi.',
          description: '<p>FNPT-II simülatöründe havayolu standartlarında kokpit iletişim ve ekip çalışması eğitimi.</p>'
        }
      ];
      this.storage.saveFullCollection('courses', initialCourses);
    }

    // --- NEWS ---
    let news = await this.storage.listCollection('news');
    if (!news || news.length === 0) {
      const initialNews = [
        {
          id: 101,
          titleTR: 'Sapmaz Academy Yerli İHA Simülasyon Testleri Başladı',
          category: 'Drone / İHA',
          author: 'Ahmet Yılmaz',
          date: '2026-08-10',
          status: 'Published',
          summaryTR: 'Yeni yerli yazılım destekli simülatörlerimizde ilk öğrenci test uçuşları başarıyla tamamlandı.',
          body: '<p>Sapmaz Academy bünyesinde geliştirilen yerli uçuş simülasyon yazılımı başarıyla devreye alındı.</p>'
        },
        {
          id: 102,
          titleTR: 'SHGM Onaylı İHA-2 ve İHA-3 Yetki Belgemiz Yenilendi',
          category: 'Sivil Havacılık',
          author: 'Mehmet Demir',
          date: '2026-08-05',
          status: 'Published',
          summaryTR: 'Sivil Havacılık Genel Müdürlüğü tarafından akademimizin yetki belgeleri 2028 yılına kadar uzatıldı.',
          body: '<p>Sapmaz Havacılık A.Ş. bünyesindeki yetkilerimiz yenilenmiştir.</p>'
        }
      ];
      this.storage.saveFullCollection('news', initialNews);
    }

    // --- RESOURCES ---
    let resources = await this.storage.listCollection('resources');
    if (!resources || resources.length === 0) {
      const initialResources = [
        {
          id: 'res-sht-iha',
          titleTR: 'SHGM İHA Talimatı (SHT-İHA Resmi Gazete Revizyonu)',
          titleEN: 'DGCA UAV Directive (SHT-UAV Official Gazette Revision)',
          category: 'directives',
          format: 'PDF Document',
          fileSize: '3.4 MB',
          fileUrl: '../assets/docs/sht_iha_directive.pdf',
          date: '2026-08-01',
          status: 'Published',
          descriptionTR: 'Sivil Havacılık Genel Müdürlüğü İHA operasyonları genel esasları ve ticari lisans gereksinimleri yönetmeliği.'
        },
        {
          id: 'res-notam-guide',
          titleTR: 'Türkiye İHA Hava Sahası & NOTAM Kısıtlı Bölge Haritası',
          titleEN: 'Turkey UAV Airspace & Restricted NOTAM Map Guide',
          category: 'regions',
          format: 'PDF Document',
          fileSize: '8.2 MB',
          fileUrl: '../assets/docs/notam_airspace_guide.pdf',
          date: '2026-07-25',
          status: 'Published',
          descriptionTR: 'Uçuşa yasak alanlar (CTR/P/R/D), izin alma prosedürleri ve irtifa limitleri kılavuzu.'
        },
        {
          id: 'res-student-logbook',
          titleTR: 'İHA Pilotaj Uçuş Kayıt Defteri (Official Logbook Template)',
          titleEN: 'UAV Pilot Flight Logbook Template',
          category: 'students',
          format: 'PDF Document',
          fileSize: '1.5 MB',
          fileUrl: '../assets/docs/student_logbook.pdf',
          date: '2026-08-02',
          status: 'Published',
          descriptionTR: 'Eğitim ve ticari uçuş saatlerinin resmi kayıt ve onayı için basılabilir standart logbook şablonu.'
        },
        {
          id: 'res-hezarfen-metar',
          titleTR: 'Hezarfen (LTBW) Canlı Meydan Durumu & METAR / TAF Rehberi',
          titleEN: 'Hezarfen Airfield METAR / TAF Live Status Guide',
          category: 'hezarfen',
          format: 'PDF Document',
          fileSize: '2.1 MB',
          fileUrl: '../assets/docs/hezarfen_airfield_guide.pdf',
          date: '2026-08-08',
          status: 'Published',
          descriptionTR: 'Hezarfen Ahmet Çelebi Havaalanı pist yönü, rüzgar limitleri ve kule frekans bilgileri.'
        },
        {
          id: 'res-faq-license',
          titleTR: 'SSS: İHA-1 Lisansı İçin Gerekli Sağlık Raporu Belgeleri',
          titleEN: 'FAQ: Medical Report Requirements for İHA-1 Certification',
          category: 'faq',
          format: 'Interactive FAQ',
          fileSize: 'Web Content',
          fileUrl: '#faq-medical',
          date: '2026-08-09',
          status: 'Published',
          descriptionTR: 'İHA-1 ve İHA-2 ticari sertifikaları için Aile Hekimi veya Yetkili Havacılık Tıp Merkezlerinden alınacak sağlık raporu detayları.'
        }
      ];
      this.storage.saveFullCollection('resources', initialResources);
    }

    // --- APPLICATIONS ---
    let apps = await this.storage.listCollection('applications');
    if (!apps || apps.length === 0) {
      const initialApps = [
        {
          id: 'APP-1001',
          name: 'Hasan Caner',
          email: 'hasan.caner@email.com',
          phone: '+90 532 111 2233',
          addressTC: '12345678901 / Kadıköy, İstanbul',
          course: 'İHA-1 — Orta Sınıf Drone Ehliyeti',
          schedule: '2026-09-01 Dönemi',
          fee: '₺14.500',
          date: '2026-08-10 11:45',
          status: 'New',
          experience: '2 yıldır hobi amaçlı FPV drone uçuruyorum.',
          files: [{ name: 'mezuniyet_belgesi.pdf', size: '1.2 MB' }],
          notes: [{ staff: 'Ahmet Yılmaz', time: '2026-08-10 12:00', text: 'Ön başvuru alındı.' }]
        },
        {
          id: 'APP-1002',
          name: 'Mehmet Yılmaz',
          email: 'mehmet@example.com',
          phone: '+90 533 222 3344',
          addressTC: '98765432109 / Çankaya, Ankara',
          course: 'İHA-2 — Büyük İHA Ehliyeti',
          schedule: '2026-09-15 Dönemi',
          fee: '₺32.000',
          date: '2026-08-10 14:20',
          status: 'New',
          experience: 'Endüstriyel haritalama projelerinde çalışıyorum.',
          files: [{ name: 'iha1_lisans.pdf', size: '2.4 MB' }],
          notes: [{ staff: 'Ahmet Yılmaz', time: '2026-08-10 14:30', text: 'İHA-2 ön kaydı kabul edildi.' }]
        }
      ];
      this.storage.saveFullCollection('applications', initialApps);
    }

    // --- CONTACTS ---
    let contacts = await this.storage.listCollection('contacts');
    if (!contacts || contacts.length === 0) {
      const initialContacts = [
        {
          id: 'CNT-8821',
          name: 'Serkan Öztürk',
          email: 'serkan@techcorp.com',
          phone: '+90 530 999 8877',
          date: '2026-08-10 10:15',
          source: 'Web İletişim Formu',
          status: 'Unread',
          priority: 'High',
          staff: 'Ahmet Yılmaz',
          subject: 'Şirket Çalışanlarımız İçin Toplu İHA-1 Eğitimi Teklifi',
          message: 'Merhaba, haritacılık firmamız bünyesinde çalışan mühendislerimiz için toplu teklif istiyoruz.'
        }
      ];
      this.storage.saveFullCollection('contacts', initialContacts);
    }
  }

  bindEvents() {
    document.querySelectorAll('.admin-nav-item a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('href').replace('#', '');
        this.navigateToView(targetView);
      });
    });

    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleGlobalSearch(e.target.value));
    }

    const notifBtn = document.getElementById('notifTriggerBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        const drop = document.getElementById('notifDropdown');
        if (drop) drop.classList.toggle('active');
      });
    }

    const drawerBackdrop = document.getElementById('drawerBackdrop');
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', () => this.closeDrawer());
    }

    const modalBackdrop = document.getElementById('modalBackdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) this.closeModal();
      });
    }
  }

  async navigateToView(viewName, params = {}) {
    this.currentView = viewName;
    document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));
    
    const activeLink = document.querySelector(`.admin-nav-item a[href="#${viewName}"]`);
    if (activeLink) {
      activeLink.parentElement.classList.add('active');
    }

    this.renderCurrentView(params);
  }

  async renderCurrentView(params = {}) {
    const mainCanvas = document.getElementById('mainCanvas');
    if (!mainCanvas) return;

    this.updateLanguageUI();

    if (this.currentView === 'overview') {
      await this.renderDashboardOverview(mainCanvas);
    } else if (this.currentView === 'applications') {
      await this.renderApplicationsView(mainCanvas);
    } else if (this.currentView === 'contacts') {
      await this.renderContactsView(mainCanvas);
    } else if (this.currentView === 'courses') {
      await this.renderCoursesView(mainCanvas);
    } else if (this.currentView === 'course-editor') {
      await this.renderCourseEditor(mainCanvas, params.courseId);
    } else if (this.currentView === 'news') {
      await this.renderNewsView(mainCanvas);
    } else if (this.currentView === 'news-editor') {
      await this.renderNewsEditor(mainCanvas, params.newsId);
    } else if (this.currentView === 'resources') {
      await this.renderResourcesView(mainCanvas);
    } else if (this.currentView === 'resource-editor') {
      await this.renderResourceEditor(mainCanvas, params.resourceId);
    } else if (this.currentView === 'settings') {
      this.renderSettingsView(mainCanvas);
    }
  }

  changeQuickCoursePage(delta) {
    this.quickCoursePage += delta;
    this.renderCurrentView();
  }

  changeQuickNewsPage(delta) {
    this.quickNewsPage += delta;
    this.renderCurrentView();
  }

  changeQuickResourcePage(delta) {
    this.quickResourcePage += delta;
    this.renderCurrentView();
  }

  // ----------------------------------------------------
  // SCREEN A: DASHBOARD OVERVIEW
  // ----------------------------------------------------
  async renderDashboardOverview(container) {
    const apps = (await this.storage.listCollection('applications')) || [];
    const contacts = (await this.storage.listCollection('contacts')) || [];
    const courses = (await this.storage.listCollection('courses')) || [];
    const news = (await this.storage.listCollection('news')) || [];
    const resources = (await this.storage.listCollection('resources')) || [];

    const newAppsCount = apps.filter(a => a.status === 'New').length;
    const unreadContactsCount = contacts.filter(c => c.status === 'Unread').length;
    const activeCoursesCount = courses.filter(c => c.status === 'Published').length;
    const draftsCount = courses.filter(c => c.status === 'Draft').length + news.filter(n => n.status === 'Draft').length;

    // Quick Courses Pagination Logic
    const totalCoursePages = Math.max(1, Math.ceil(courses.length / this.quickItemsPerPage));
    if (this.quickCoursePage > totalCoursePages) this.quickCoursePage = totalCoursePages;
    if (this.quickCoursePage < 1) this.quickCoursePage = 1;
    const startCourseIdx = (this.quickCoursePage - 1) * this.quickItemsPerPage;
    const paginatedCourses = courses.slice(startCourseIdx, startCourseIdx + this.quickItemsPerPage);

    // Quick News Pagination Logic
    const totalNewsPages = Math.max(1, Math.ceil(news.length / this.quickItemsPerPage));
    if (this.quickNewsPage > totalNewsPages) this.quickNewsPage = totalNewsPages;
    if (this.quickNewsPage < 1) this.quickNewsPage = 1;
    const startNewsIdx = (this.quickNewsPage - 1) * this.quickItemsPerPage;
    const paginatedNews = news.slice(startNewsIdx, startNewsIdx + this.quickItemsPerPage);

    // Quick Resources Pagination Logic
    const totalResourcePages = Math.max(1, Math.ceil(resources.length / this.quickItemsPerPage));
    if (this.quickResourcePage > totalResourcePages) this.quickResourcePage = totalResourcePages;
    if (this.quickResourcePage < 1) this.quickResourcePage = 1;
    const startResourceIdx = (this.quickResourcePage - 1) * this.quickItemsPerPage;
    const paginatedResources = resources.slice(startResourceIdx, startResourceIdx + this.quickItemsPerPage);

    container.innerHTML = `
      <div class="page-top-bar">
        <div class="page-title-group">
          <h1>${this.t('dash_title')}</h1>
          <p>${this.t('dash_desc')}</p>
        </div>
        <div class="page-actions-group">
          <button class="btn btn-primary" onclick="app.navigateToView('course-editor')">
            ${this.t('btn_new_course')}
          </button>
          <button class="btn btn-secondary" onclick="app.navigateToView('news-editor')">
            ${this.t('btn_new_news')}
          </button>
          <button class="btn btn-secondary" onclick="app.navigateToView('resource-editor')">
            ${this.t('btn_new_resource')}
          </button>
        </div>
      </div>

      <div class="stat-cards-grid">
        <div class="stat-card" onclick="app.navigateToView('applications')">
          <div class="stat-card-header">
            <span class="stat-card-title">${this.t('stat_new_apps')}</span>
            <div class="stat-card-icon stat-icon-amber">📥</div>
          </div>
          <div class="stat-card-value">${newAppsCount}</div>
          <div class="stat-card-footer">
            <span>${this.t('tag_inquiry_queue')}</span>
            <span class="stat-tag stat-tag-urgent">${newAppsCount > 0 ? newAppsCount + ' ' + this.t('tag_urgent') : this.t('tag_clear')}</span>
          </div>
        </div>

        <div class="stat-card" onclick="app.navigateToView('contacts')">
          <div class="stat-card-header">
            <span class="stat-card-title">${this.t('stat_unread_cnt')}</span>
            <div class="stat-card-icon stat-icon-blue">💬</div>
          </div>
          <div class="stat-card-value">${unreadContactsCount}</div>
          <div class="stat-card-footer">
            <span>${this.t('tag_web_inquiries')}</span>
            <span class="stat-tag stat-tag-today">${unreadContactsCount > 0 ? this.t('tag_action_needed') : this.t('tag_all_read')}</span>
          </div>
        </div>

        <div class="stat-card" onclick="app.navigateToView('courses')">
          <div class="stat-card-header">
            <span class="stat-card-title">${this.t('stat_active_courses')}</span>
            <div class="stat-card-icon stat-icon-green">🎓</div>
          </div>
          <div class="stat-card-value">${activeCoursesCount}</div>
          <div class="stat-card-footer">
            <span>${this.t('tag_published_progs')}</span>
            <span class="stat-tag stat-tag-info">${this.t('tag_shgm_cert')}</span>
          </div>
        </div>

        <div class="stat-card" onclick="app.navigateToView('news')">
          <div class="stat-card-header">
            <span class="stat-card-title">${this.t('stat_drafts')}</span>
            <div class="stat-card-icon stat-icon-purple">📰</div>
          </div>
          <div class="stat-card-value">${draftsCount}</div>
          <div class="stat-card-footer">
            <span>${this.t('tag_unpublished')}</span>
            <span class="stat-tag stat-tag-info">${this.t('tag_in_review')}</span>
          </div>
        </div>
      </div>

      <div class="twin-inbox-grid">
        <div class="inbox-panel">
          <div class="panel-header">
            <span class="panel-title">${this.t('recent_apps_title')}</span>
            <button class="btn btn-secondary btn-sm" onclick="app.navigateToView('applications')">${this.t('view_all')}</button>
          </div>
          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>${this.t('col_applicant')}</th>
                  <th>${this.t('col_course')}</th>
                  <th>${this.t('col_date')}</th>
                  <th>${this.t('col_status')}</th>
                </tr>
              </thead>
              <tbody>
                ${apps.slice(0, 4).map(appItem => `
                  <tr onclick="app.openApplicationDrawer('${appItem.id}')">
                    <td><strong>${appItem.name}</strong></td>
                    <td>${appItem.course}</td>
                    <td>${appItem.date.split(' ')[0]}</td>
                    <td><span class="badge-status badge-${appItem.status.toLowerCase().replace(' ', '')}">${this.t('status_' + appItem.status)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="inbox-panel">
          <div class="panel-header">
            <span class="panel-title">${this.t('unread_cnt_title')}</span>
            <button class="btn btn-secondary btn-sm" onclick="app.navigateToView('contacts')">${this.t('view_all')}</button>
          </div>
          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>${this.t('col_from')}</th>
                  <th>${this.t('col_subject')}</th>
                  <th>${this.t('col_date')}</th>
                </tr>
              </thead>
              <tbody>
                ${contacts.slice(0, 4).map(cnt => `
                  <tr onclick="app.openContactDrawer('${cnt.id}')">
                    <td><strong>${cnt.name}</strong></td>
                    <td>${cnt.subject.substring(0, 30)}...</td>
                    <td>${cnt.date.split(' ')[0]}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 3-Column Paginated Quick Content Management Widget -->
      <div class="quick-content-widget">
        <div class="panel-header">
          <span class="panel-title">${this.t('quick_content_title')}</span>
        </div>
        <div class="quick-content-grid">
          <!-- Active Courses Column with Paging -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div style="font-size:0.8rem; font-weight:800; color:var(--admin-accent-primary); text-transform:uppercase;">
                ${this.t('active_courses_sub')}
              </div>
              <div style="display:flex; align-items:center; gap:8px; font-size:0.78rem; font-weight:700; color:var(--admin-text-muted);">
                <button class="btn btn-secondary btn-sm" style="padding:2px 8px;" onclick="app.changeQuickCoursePage(-1)" ${this.quickCoursePage === 1 ? 'disabled' : ''}>‹</button>
                <span>${this.quickCoursePage} / ${totalCoursePages}</span>
                <button class="btn btn-secondary btn-sm" style="padding:2px 8px;" onclick="app.changeQuickCoursePage(1)" ${this.quickCoursePage === totalCoursePages ? 'disabled' : ''}>›</button>
              </div>
            </div>
            ${paginatedCourses.map(c => `
              <div class="quick-list-item">
                <div>
                  <div class="quick-item-title">${c.titleTR}</div>
                  <div class="quick-item-sub">${c.category} • ${c.fee}</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="app.navigateToView('course-editor', {courseId:'${c.id}'})">${this.t('edit')}</button>
              </div>
            `).join('')}
          </div>

          <!-- Recent News Column with Paging -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div style="font-size:0.8rem; font-weight:800; color:var(--admin-accent-primary); text-transform:uppercase;">
                ${this.t('recent_news_sub')}
              </div>
              <div style="display:flex; align-items:center; gap:8px; font-size:0.78rem; font-weight:700; color:var(--admin-text-muted);">
                <button class="btn btn-secondary btn-sm" style="padding:2px 8px;" onclick="app.changeQuickNewsPage(-1)" ${this.quickNewsPage === 1 ? 'disabled' : ''}>‹</button>
                <span>${this.quickNewsPage} / ${totalNewsPages}</span>
                <button class="btn btn-secondary btn-sm" style="padding:2px 8px;" onclick="app.changeQuickNewsPage(1)" ${this.quickNewsPage === totalNewsPages ? 'disabled' : ''}>›</button>
              </div>
            </div>
            ${paginatedNews.map(n => `
              <div class="quick-list-item">
                <div>
                  <div class="quick-item-title">${n.titleTR}</div>
                  <div class="quick-item-sub">${n.category} • ${n.date}</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="app.navigateToView('news-editor', {newsId:${n.id}})">${this.t('edit')}</button>
              </div>
            `).join('')}
          </div>

          <!-- Resource Pool Files Column with Paging -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div style="font-size:0.8rem; font-weight:800; color:var(--admin-accent-primary); text-transform:uppercase;">
                ${this.t('recent_resources_sub')}
              </div>
              <div style="display:flex; align-items:center; gap:8px; font-size:0.78rem; font-weight:700; color:var(--admin-text-muted);">
                <button class="btn btn-secondary btn-sm" style="padding:2px 8px;" onclick="app.changeQuickResourcePage(-1)" ${this.quickResourcePage === 1 ? 'disabled' : ''}>‹</button>
                <span>${this.quickResourcePage} / ${totalResourcePages}</span>
                <button class="btn btn-secondary btn-sm" style="padding:2px 8px;" onclick="app.changeQuickResourcePage(1)" ${this.quickResourcePage === totalResourcePages ? 'disabled' : ''}>›</button>
              </div>
            </div>
            ${paginatedResources.map(r => `
              <div class="quick-list-item">
                <div>
                  <div class="quick-item-title">${r.titleTR}</div>
                  <div class="quick-item-sub">${r.category} • ${r.format}</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="app.navigateToView('resource-editor', {resourceId:'${r.id}'})">${this.t('edit')}</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------
  // APPLICATIONS INBOX & DRAWER (SCREEN B) WITH PER-COLUMN FILTERING
  // ----------------------------------------------------
  async renderApplicationsView(container) {
    const apps = (await this.storage.listCollection('applications')) || [];
    const filters = this.columnFilters['applications'] || {};
    const hasActiveFilters = Object.keys(filters).length > 0;

    // Multi-Column Filtering Engine
    const filteredApps = apps.filter(item => {
      if (filters.id && !item.id.toLowerCase().includes(filters.id.toLowerCase())) return false;
      if (filters.applicant && !item.name.toLowerCase().includes(filters.applicant.toLowerCase()) && !item.email.toLowerCase().includes(filters.applicant.toLowerCase())) return false;
      if (filters.course && filters.course !== 'ALL' && !item.course.toLowerCase().includes(filters.course.toLowerCase())) return false;
      if (filters.date && !item.date.toLowerCase().includes(filters.date.toLowerCase())) return false;
      if (filters.status && filters.status !== 'ALL' && item.status.toLowerCase().replace(' ','') !== filters.status.toLowerCase().replace(' ','')) return false;
      return true;
    });

    container.innerHTML = `
      <div class="page-top-bar">
        <div class="page-title-group">
          <h1>📥 ${this.t('nav_applications')}</h1>
          <p>${this.t('dash_desc')} (${this.t('lbl_filtered_count')} ${filteredApps.length} / ${apps.length})</p>
        </div>
        ${hasActiveFilters ? `
          <button class="btn btn-secondary" onclick="app.clearColumnFilters('applications')" style="color:var(--admin-accent-primary); font-weight:800;">
            ${this.t('btn_clear_filters')}
          </button>
        ` : ''}
      </div>

      <div class="inbox-panel">
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>${this.t('col_applicant')}</th>
                <th>${this.t('col_course')}</th>
                <th>${this.t('col_date')}</th>
                <th>${this.t('col_status')}</th>
                <th>${this.t('col_action')}</th>
              </tr>
              <!-- Column Filter Bar Row -->
              <tr class="filter-header-row">
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.id || ''}" oninput="app.setColumnFilter('applications', 'id', this.value)">
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.applicant || ''}" oninput="app.setColumnFilter('applications', 'applicant', this.value)">
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('applications', 'course', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="İHA-0" ${filters.course === 'İHA-0' ? 'selected' : ''}>İHA-0</option>
                    <option value="İHA-1" ${filters.course === 'İHA-1' ? 'selected' : ''}>İHA-1</option>
                    <option value="İHA-2" ${filters.course === 'İHA-2' ? 'selected' : ''}>İHA-2</option>
                    <option value="İHA-3" ${filters.course === 'İHA-3' ? 'selected' : ''}>İHA-3</option>
                    <option value="PPL" ${filters.course === 'PPL' ? 'selected' : ''}>PPL</option>
                    <option value="ATPL" ${filters.course === 'ATPL' ? 'selected' : ''}>ATPL</option>
                    <option value="CPL" ${filters.course === 'CPL' ? 'selected' : ''}>CPL</option>
                    <option value="NR" ${filters.course === 'NR' ? 'selected' : ''}>NR</option>
                    <option value="PIC" ${filters.course === 'PIC' ? 'selected' : ''}>PIC</option>
                    <option value="IR" ${filters.course === 'IR' ? 'selected' : ''}>IR</option>
                    <option value="ME" ${filters.course === 'ME' ? 'selected' : ''}>ME</option>
                    <option value="MCC" ${filters.course === 'MCC' ? 'selected' : ''}>MCC</option>
                  </select>
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.date || ''}" oninput="app.setColumnFilter('applications', 'date', this.value)">
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('applications', 'status', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="New" ${filters.status === 'New' ? 'selected' : ''}>New (${this.t('status_New')})</option>
                    <option value="Pending Review" ${filters.status === 'Pending Review' ? 'selected' : ''}>Pending Review (${this.t('status_Pending Review')})</option>
                    <option value="Approved" ${filters.status === 'Approved' ? 'selected' : ''}>Approved (${this.t('status_Approved')})</option>
                    <option value="Rejected" ${filters.status === 'Rejected' ? 'selected' : ''}>Rejected (${this.t('status_Rejected')})</option>
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${filteredApps.length > 0 ? filteredApps.map(item => `
                <tr>
                  <td><span class="drawer-id">${item.id}</span></td>
                  <td><strong>${item.name}</strong><br><span style="font-size:0.75rem; color:var(--admin-text-muted);">${item.email}</span></td>
                  <td>${item.course}</td>
                  <td>${item.date}</td>
                  <td><span class="badge-status badge-${item.status.toLowerCase().replace(' ', '')}">${this.t('status_' + item.status)}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="app.openApplicationDrawer('${item.id}')">${this.t('view_details')}</button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="6" style="text-align:center; padding:32px; color:var(--admin-text-muted);">
                    Filtrelere uygun başvuru kaydı bulunamadı.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async openApplicationDrawer(appId) {
    const apps = (await this.storage.listCollection('applications')) || [];
    const item = apps.find(a => a.id === appId);
    if (!item) return;

    this.activeAppId = appId;
    const drawerPanel = document.getElementById('drawerPanel');
    const drawerBackdrop = document.getElementById('drawerBackdrop');

    drawerPanel.innerHTML = `
      <div class="drawer-header">
        <div class="drawer-title-group">
          <span class="drawer-id">#${item.id}</span>
          <span style="font-size:0.95rem; font-weight:800;">${this.t('drawer_app_title')}</span>
        </div>
        <div class="drawer-controls">
          <button class="btn btn-secondary btn-sm" onclick="window.print()">${this.t('print')}</button>
          <button class="drawer-close-btn" onclick="app.closeDrawer()">✕</button>
        </div>
      </div>

      <div class="drawer-body">
        <div class="drawer-block">
          <div class="block-title">${this.t('block_status')}</div>
          <select class="form-control" onchange="app.updateAppStatus('${item.id}', this.value)" style="font-weight:700;">
            <option value="New" ${item.status === 'New' ? 'selected' : ''}>New (${this.t('status_New')})</option>
            <option value="Pending Review" ${item.status === 'Pending Review' ? 'selected' : ''}>Pending Review (${this.t('status_Pending Review')})</option>
            <option value="Approved" ${item.status === 'Approved' ? 'selected' : ''}>Approved (${this.t('status_Approved')})</option>
            <option value="Rejected" ${item.status === 'Rejected' ? 'selected' : ''}>Rejected (${this.t('status_Rejected')})</option>
          </select>
        </div>

        <div class="drawer-block">
          <div class="block-title">${this.t('block_applicant_info')}</div>
          <div class="detail-row-grid">
            <div class="detail-item"><label>${this.t('lbl_full_name')}</label><span>${item.name}</span></div>
            <div class="detail-item"><label>${this.t('lbl_email')}</label><span>${item.email}</span></div>
            <div class="detail-item"><label>${this.t('lbl_phone')}</label><span>${item.phone}</span></div>
            <div class="detail-item"><label>${this.t('lbl_submission_date')}</label><span>${item.date}</span></div>
          </div>
          <div class="detail-item" style="margin-top:12px;">
            <label>${this.t('lbl_id_address')}</label>
            <span>${item.addressTC}</span>
          </div>
        </div>

        <div class="drawer-block">
          <div class="block-title">${this.t('block_course_info')}</div>
          <div class="detail-row-grid">
            <div class="detail-item"><label>${this.t('lbl_course_name')}</label><span style="color:var(--admin-accent-primary);">${item.course}</span></div>
            <div class="detail-item"><label>${this.t('lbl_schedule')}</label><span>${item.schedule}</span></div>
            <div class="detail-item"><label>${this.t('lbl_fee')}</label><span>${item.fee}</span></div>
          </div>
        </div>

        <div class="drawer-block">
          <div class="block-title">${this.t('block_experience')}</div>
          <p style="font-size:0.86rem; color:var(--admin-text-main); line-height:1.5;">${item.experience || this.t('lbl_not_specified')}</p>
          <div style="margin-top:14px; font-weight:800; font-size:0.78rem; color:var(--admin-text-muted); text-transform:uppercase;">${this.t('lbl_attached_files')}</div>
          ${item.files && item.files.length > 0 ? item.files.map(f => `
            <div class="attached-file-item">
              <div class="attached-file-info">
                <span>📄</span>
                <div>
                  <div class="attached-file-name">${f.name}</div>
                  <div class="attached-file-size">${f.size}</div>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="app.showToast('Document preview loaded')">Preview</button>
            </div>
          `).join('') : `<div style="font-size:0.8rem; color:var(--admin-text-dim); margin-top:6px;">${this.t('lbl_no_docs')}</div>`}
        </div>

        <div class="drawer-block">
          <div class="block-title">${this.t('block_notes')}</div>
          <div class="audit-notes-list" id="appNotesList">
            ${item.notes ? item.notes.map(n => `
              <div class="audit-note-item">
                <div class="audit-note-meta">[${n.staff} - ${n.time}]</div>
                <div>${n.text}</div>
              </div>
            `).join('') : ''}
          </div>
          <div style="display:flex; gap:8px;">
            <input type="text" id="newAppNoteInput" class="form-control" placeholder="${this.t('placeholder_staff_note')}" style="font-size:0.84rem;">
            <button class="btn btn-primary btn-sm" onclick="app.addAppNote('${item.id}')">${this.t('btn_add_note')}</button>
          </div>
        </div>

        <div class="drawer-block">
          <div class="block-title">${this.t('block_comm')}</div>
          <div class="form-group" style="margin-bottom:12px;">
            <label>${this.t('lbl_select_email_template')}</label>
            <select class="form-control" onchange="app.fillAppEmailTemplate(this.value, '${item.name}', '${item.course}')">
              <option value="">${this.t('opt_select_template')}</option>
              <option value="acceptance">${this.t('opt_acceptance_letter')}</option>
              <option value="missing_docs">${this.t('opt_request_missing')}</option>
            </select>
          </div>
          <textarea id="appEmailBody" class="form-control" style="font-size:0.84rem; min-height:80px;" placeholder="${this.t('placeholder_email_body')}"></textarea>
          <div style="display:flex; gap:10px; margin-top:12px; justify-content:flex-end;">
            <button class="btn btn-success btn-sm" onclick="app.sendApplicantEmail()">${this.t('btn_send_email')}</button>
          </div>
        </div>
      </div>
    `;

    drawerBackdrop.classList.add('active');
    drawerPanel.classList.add('active');
  }

  async updateAppStatus(appId, newStatus) {
    let apps = (await this.storage.listCollection('applications')) || [];
    const idx = apps.findIndex(a => a.id === appId);
    if (idx >= 0) {
      apps[idx].status = newStatus;
      await this.storage.saveItem('applications', `${appId}.json`, apps[idx]);
      this.showToast(`Application #${appId} status updated to: ${newStatus}`, 'success');
      this.renderCurrentView();
    }
  }

  async addAppNote(appId) {
    const input = document.getElementById('newAppNoteInput');
    if (!input || !input.value.trim()) return;

    let apps = (await this.storage.listCollection('applications')) || [];
    const idx = apps.findIndex(a => a.id === appId);
    if (idx >= 0) {
      if (!apps[idx].notes) apps[idx].notes = [];
      const newNote = {
        staff: 'Ahmet Yılmaz',
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        text: input.value.trim()
      };
      apps[idx].notes.push(newNote);
      await this.storage.saveItem('applications', `${appId}.json`, apps[idx]);
      this.openApplicationDrawer(appId);
      this.showToast('Internal note saved.', 'success');
    }
  }

  fillAppEmailTemplate(type, name, course) {
    const body = document.getElementById('appEmailBody');
    if (!body) return;
    if (type === 'acceptance') {
      body.value = `Sayın ${name},\n\nSapmaz UAV Academy bünyesinde açılan "${course}" programı başvurunuz onaylanmıştır. Ders takvimi ve kesin kayıt belgeleri ekte sunulmuştur.\n\nSaygılarımızla,\nSapmaz Academy Yönetim Kurulu`;
    } else if (type === 'missing_docs') {
      body.value = `Sayın ${name},\n\n"${course}" başvurunuzun tamamlanabilmesi için eksik olan öğrenci/mezuniyet belgesi ve vesikalık fotoğrafınızı bu e-postaya yanıt olarak göndermenizi rica ederiz.\n\nSaygılarımızla,\nSapmaz Academy`;
    }
  }

  sendApplicantEmail() {
    const body = document.getElementById('appEmailBody');
    if (body && body.value) {
      this.showToast('Email sent to applicant successfully!', 'success');
      body.value = '';
    }
  }

  // ----------------------------------------------------
  // CONTACT INQUIRIES & DRAWER (SCREEN D) WITH PER-COLUMN FILTERING
  // ----------------------------------------------------
  async renderContactsView(container) {
    const contacts = (await this.storage.listCollection('contacts')) || [];
    const filters = this.columnFilters['contacts'] || {};
    const hasActiveFilters = Object.keys(filters).length > 0;

    // Multi-Column Filtering Engine
    const filteredContacts = contacts.filter(item => {
      if (filters.id && !item.id.toLowerCase().includes(filters.id.toLowerCase())) return false;
      if (filters.from && !item.name.toLowerCase().includes(filters.from.toLowerCase()) && !item.email.toLowerCase().includes(filters.from.toLowerCase())) return false;
      if (filters.subject && !item.subject.toLowerCase().includes(filters.subject.toLowerCase())) return false;
      if (filters.date && !item.date.toLowerCase().includes(filters.date.toLowerCase())) return false;
      if (filters.priority && filters.priority !== 'ALL' && item.priority.toLowerCase() !== filters.priority.toLowerCase()) return false;
      if (filters.status && filters.status !== 'ALL' && item.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      return true;
    });

    container.innerHTML = `
      <div class="page-top-bar">
        <div class="page-title-group">
          <h1>💬 ${this.t('nav_contacts')}</h1>
          <p>${this.t('dash_desc')} (${this.t('lbl_filtered_count')} ${filteredContacts.length} / ${contacts.length})</p>
        </div>
        ${hasActiveFilters ? `
          <button class="btn btn-secondary" onclick="app.clearColumnFilters('contacts')" style="color:var(--admin-accent-primary); font-weight:800;">
            ${this.t('btn_clear_filters')}
          </button>
        ` : ''}
      </div>

      <div class="inbox-panel">
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>${this.t('col_from')}</th>
                <th>${this.t('col_subject')}</th>
                <th>${this.t('col_date')}</th>
                <th>${this.t('col_priority')}</th>
                <th>${this.t('col_status')}</th>
                <th>${this.t('col_action')}</th>
              </tr>
              <!-- Column Filter Bar Row -->
              <tr class="filter-header-row">
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.id || ''}" oninput="app.setColumnFilter('contacts', 'id', this.value)">
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.from || ''}" oninput="app.setColumnFilter('contacts', 'from', this.value)">
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.subject || ''}" oninput="app.setColumnFilter('contacts', 'subject', this.value)">
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.date || ''}" oninput="app.setColumnFilter('contacts', 'date', this.value)">
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('contacts', 'priority', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="Low" ${filters.priority === 'Low' ? 'selected' : ''}>Low</option>
                    <option value="Normal" ${filters.priority === 'Normal' ? 'selected' : ''}>Normal</option>
                    <option value="High" ${filters.priority === 'High' ? 'selected' : ''}>High</option>
                  </select>
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('contacts', 'status', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="Unread" ${filters.status === 'Unread' ? 'selected' : ''}>Unread (${this.t('status_Unread')})</option>
                    <option value="Read" ${filters.status === 'Read' ? 'selected' : ''}>Read (${this.t('status_Read')})</option>
                    <option value="Resolved" ${filters.status === 'Resolved' ? 'selected' : ''}>Resolved (${this.t('status_Resolved')})</option>
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${filteredContacts.length > 0 ? filteredContacts.map(item => `
                <tr>
                  <td><span class="drawer-id">${item.id}</span></td>
                  <td><strong>${item.name}</strong><br><span style="font-size:0.75rem; color:var(--admin-text-muted);">${item.email}</span></td>
                  <td>${item.subject}</td>
                  <td>${item.date}</td>
                  <td><span class="badge-status badge-${item.priority === 'High' ? 'rejected' : 'pending'}">${item.priority}</span></td>
                  <td><span class="badge-status badge-${item.status.toLowerCase()}">${this.t('status_' + item.status)}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="app.openContactDrawer('${item.id}')">${this.t('view_details')}</button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" style="text-align:center; padding:32px; color:var(--admin-text-muted);">
                    Filtrelere uygun mesaj bulunamadı.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async openContactDrawer(cntId) {
    const contacts = (await this.storage.listCollection('contacts')) || [];
    const item = contacts.find(c => c.id === cntId);
    if (!item) return;

    this.activeContactId = cntId;
    const drawerPanel = document.getElementById('drawerPanel');
    const drawerBackdrop = document.getElementById('drawerBackdrop');

    if (item.status === 'Unread') {
      item.status = 'Read';
      await this.storage.saveItem('contacts', `${cntId}.json`, item);
      this.updateNotificationBadges();
    }

    drawerPanel.innerHTML = `
      <div class="drawer-header">
        <div class="drawer-title-group">
          <span class="drawer-id">#${item.id}</span>
          <span style="font-size:0.95rem; font-weight:800;">${this.t('drawer_cnt_title')}</span>
        </div>
        <div class="drawer-controls">
          <button class="btn btn-secondary btn-sm" onclick="window.print()">${this.t('print')}</button>
          <button class="drawer-close-btn" onclick="app.closeDrawer()">✕</button>
        </div>
      </div>

      <div class="drawer-body">
        <div class="drawer-block">
          <div class="detail-row-grid">
            <div>
              <label>${this.t('col_status')}</label>
              <select class="form-control" onchange="app.updateContactStatus('${item.id}', this.value)">
                <option value="Unread" ${item.status === 'Unread' ? 'selected' : ''}>Unread (${this.t('status_Unread')})</option>
                <option value="Read" ${item.status === 'Read' ? 'selected' : ''}>Read (${this.t('status_Read')})</option>
                <option value="Resolved" ${item.status === 'Resolved' ? 'selected' : ''}>Resolved (${this.t('status_Resolved')})</option>
              </select>
            </div>
            <div>
              <label>${this.t('col_priority')}</label>
              <select class="form-control" onchange="app.updateContactPriority('${item.id}', this.value)">
                <option value="Low" ${item.priority === 'Low' ? 'selected' : ''}>Low</option>
                <option value="Normal" ${item.priority === 'Normal' ? 'selected' : ''}>Normal</option>
                <option value="High" ${item.priority === 'High' ? 'selected' : ''}>High</option>
              </select>
            </div>
          </div>
        </div>

        <div class="drawer-block">
          <div class="block-title">${this.t('block_applicant_info')}</div>
          <div class="detail-row-grid">
            <div class="detail-item"><label>${this.t('lbl_full_name')}</label><span>${item.name}</span></div>
            <div class="detail-item"><label>${this.t('lbl_email')}</label><span>${item.email}</span></div>
            <div class="detail-item"><label>${this.t('lbl_phone')}</label><span>${item.phone}</span></div>
            <div class="detail-item"><label>${this.t('lbl_submission_date')}</label><span>${item.date}</span></div>
          </div>
        </div>

        <div class="drawer-block">
          <div class="block-title">${this.t('block_message_body')}</div>
          <div style="font-weight:800; font-size:0.95rem; margin-bottom:8px; color:var(--admin-accent-primary);">${item.subject}</div>
          <p style="font-size:0.88rem; line-height:1.6; color:var(--admin-text-main);">${item.message}</p>
        </div>

        <div class="drawer-block">
          <div class="block-title">${this.t('block_quick_reply')}</div>
          <div class="form-group">
            <label>${this.t('lbl_select_email_template')}</label>
            <select class="form-control" onchange="app.fillContactReplyTemplate(this.value, '${item.name}')">
              <option value="">${this.t('opt_select_template')}</option>
              <option value="general">${this.t('opt_reply_general')}</option>
              <option value="corporate">${this.t('opt_reply_corporate')}</option>
            </select>
          </div>
          <textarea id="contactReplyText" class="form-control" placeholder="${this.t('placeholder_reply_body')}"></textarea>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
            <button class="btn btn-secondary btn-sm" onclick="app.showToast('File attached')">${this.t('btn_attach_file')}</button>
            <button class="btn btn-primary btn-sm" onclick="app.sendContactReply('${item.id}')">${this.t('btn_reply_archive')}</button>
          </div>
        </div>
      </div>
    `;

    drawerBackdrop.classList.add('active');
    drawerPanel.classList.add('active');
  }

  async updateContactStatus(cntId, status) {
    let contacts = (await this.storage.listCollection('contacts')) || [];
    const idx = contacts.findIndex(c => c.id === cntId);
    if (idx >= 0) {
      contacts[idx].status = status;
      await this.storage.saveItem('contacts', `${cntId}.json`, contacts[idx]);
      this.showToast(`Inquiry marked as: ${status}`, 'success');
      this.renderCurrentView();
    }
  }

  async updateContactPriority(cntId, priority) {
    let contacts = (await this.storage.listCollection('contacts')) || [];
    const idx = contacts.findIndex(c => c.id === cntId);
    if (idx >= 0) {
      contacts[idx].priority = priority;
      await this.storage.saveItem('contacts', `${cntId}.json`, contacts[idx]);
      this.showToast(`Priority updated to: ${priority}`, 'success');
    }
  }

  fillContactReplyTemplate(type, name) {
    const area = document.getElementById('contactReplyText');
    if (!area) return;
    if (type === 'general') {
      area.value = `Sayın ${name},\n\nİlettiğiniz mesajınız tarafımıza ulaşmıştır. Talep ettiğiniz bilgiler doğrultusunda eğitim danışmanımız sizinle kısa süre içerisinde iletişime geçecektir.\n\nSaygılarımızla,\nSapmaz UAV Academy`;
    } else if (type === 'corporate') {
      area.value = `Sayın ${name},\n\nKurumsal İHA-1/İHA-2 eğitim talebiniz için teşekkür ederiz. Şirket çalışanlarınıza özel grup indirimi ve takvim teklifimiz ekte yer almaktadır.\n\nSaygılarımızla,\nSapmaz Academy Kurumsal Hizmetler`;
    }
  }

  async sendContactReply(cntId) {
    await this.updateContactStatus(cntId, 'Resolved');
    this.closeDrawer();
    this.showToast('Reply sent and inquiry archived.', 'success');
  }

  closeDrawer() {
    const drawerPanel = document.getElementById('drawerPanel');
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    if (drawerPanel) drawerPanel.classList.remove('active');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
  }

  // ----------------------------------------------------
  // COURSE LISTING EDITOR & CRUD (SCREEN C) WITH PER-COLUMN FILTERING
  // ----------------------------------------------------
  async renderCoursesView(container) {
    const courses = (await this.storage.listCollection('courses')) || [];
    const filters = this.columnFilters['courses'] || {};
    const hasActiveFilters = Object.keys(filters).length > 0;

    // Multi-Column Filtering Engine
    const filteredCourses = courses.filter(item => {
      if (filters.title && !item.titleTR.toLowerCase().includes(filters.title.toLowerCase())) return false;
      if (filters.category && filters.category !== 'ALL' && !item.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
      if (filters.duration && !item.duration.toLowerCase().includes(filters.duration.toLowerCase())) return false;
      if (filters.fee && !item.fee.toLowerCase().includes(filters.fee.toLowerCase())) return false;
      if (filters.nextDate && !item.nextDate.toLowerCase().includes(filters.nextDate.toLowerCase())) return false;
      if (filters.status && filters.status !== 'ALL' && item.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      return true;
    });

    container.innerHTML = `
      <div class="page-top-bar">
        <div class="page-title-group">
          <h1>📚 ${this.t('nav_courses')}</h1>
          <p>${this.t('dash_desc')} (${this.t('lbl_filtered_count')} ${filteredCourses.length} / ${courses.length})</p>
        </div>
        <div style="display:flex; gap:12px;">
          ${hasActiveFilters ? `
            <button class="btn btn-secondary" onclick="app.clearColumnFilters('courses')" style="color:var(--admin-accent-primary); font-weight:800;">
              ${this.t('btn_clear_filters')}
            </button>
          ` : ''}
          <button class="btn btn-primary" onclick="app.navigateToView('course-editor')">${this.t('btn_new_course')}</button>
        </div>
      </div>

      <div class="inbox-panel">
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>${this.t('col_title')}</th>
                <th>${this.t('col_category')}</th>
                <th>${this.t('col_duration')}</th>
                <th>${this.t('col_fee')}</th>
                <th>${this.t('col_next_start')}</th>
                <th>${this.t('col_status')}</th>
                <th>${this.t('col_action')}</th>
              </tr>
              <!-- Column Filter Bar Row -->
              <tr class="filter-header-row">
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.title || ''}" oninput="app.setColumnFilter('courses', 'title', this.value)">
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('courses', 'category', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="İHA-0" ${filters.category === 'İHA-0' ? 'selected' : ''}>İHA-0</option>
                    <option value="İHA-1" ${filters.category === 'İHA-1' ? 'selected' : ''}>İHA-1</option>
                    <option value="İHA-2" ${filters.category === 'İHA-2' ? 'selected' : ''}>İHA-2</option>
                    <option value="İHA-3" ${filters.category === 'İHA-3' ? 'selected' : ''}>İHA-3</option>
                    <option value="PPL" ${filters.category === 'PPL' ? 'selected' : ''}>PPL</option>
                    <option value="ATPL" ${filters.category === 'ATPL' ? 'selected' : ''}>ATPL</option>
                    <option value="CPL" ${filters.category === 'CPL' ? 'selected' : ''}>CPL</option>
                    <option value="NR" ${filters.category === 'NR' ? 'selected' : ''}>NR</option>
                    <option value="PIC" ${filters.category === 'PIC' ? 'selected' : ''}>PIC</option>
                    <option value="IR" ${filters.category === 'IR' ? 'selected' : ''}>IR</option>
                    <option value="ME" ${filters.category === 'ME' ? 'selected' : ''}>ME</option>
                    <option value="MCC" ${filters.category === 'MCC' ? 'selected' : ''}>MCC</option>
                  </select>
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.duration || ''}" oninput="app.setColumnFilter('courses', 'duration', this.value)">
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.fee || ''}" oninput="app.setColumnFilter('courses', 'fee', this.value)">
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.nextDate || ''}" oninput="app.setColumnFilter('courses', 'nextDate', this.value)">
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('courses', 'status', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="Published" ${filters.status === 'Published' ? 'selected' : ''}>Published (${this.t('status_Published')})</option>
                    <option value="Draft" ${filters.status === 'Draft' ? 'selected' : ''}>Draft (${this.t('status_Draft')})</option>
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${filteredCourses.length > 0 ? filteredCourses.map(c => `
                <tr>
                  <td><strong>${c.titleTR}</strong></td>
                  <td>${c.category}</td>
                  <td>${c.duration}</td>
                  <td>${c.fee}</td>
                  <td>${c.nextDate}</td>
                  <td><span class="badge-status badge-${c.status.toLowerCase()}">${this.t('status_' + c.status)}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="app.navigateToView('course-editor', {courseId:'${c.id}'})">${this.t('edit')}</button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" style="text-align:center; padding:32px; color:var(--admin-text-muted);">
                    Filtrelere uygun kurs kaydı bulunamadı.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async renderCourseEditor(container, courseId = null) {
    let course = {
      id: 'course-' + Date.now(),
      titleTR: '',
      category: 'İHA-1 (Orta Sınıf Drone Ehliyeti)',
      duration: '',
      capacity: 20,
      fee: '',
      nextDate: '',
      status: 'Draft',
      excerpt: '',
      description: ''
    };

    if (courseId) {
      const courses = (await this.storage.listCollection('courses')) || [];
      const found = courses.find(c => c.id === courseId);
      if (found) course = found;
    }

    this.editingCourseId = course.id;

    container.innerHTML = `
      <div class="page-top-bar">
        <div class="page-title-group">
          <a href="#courses" onclick="app.navigateToView('courses')" style="color:var(--admin-text-muted); font-size:0.85rem; text-decoration:none;">${this.t('btn_back_courses')}</a>
          <h1 style="margin-top:6px;">${courseId ? this.t('title_edit_course') : this.t('title_create_course')}</h1>
        </div>
      </div>

      <div class="editor-container">
        <div class="form-section-title">${this.t('sec_basic_info')}</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>${this.t('lbl_course_title')}</label>
            <input type="text" id="courseTitleInput" class="form-control" value="${course.titleTR}" placeholder="Örn: İHA-1 — Orta Sınıf Drone Ehliyeti">
          </div>
          <div class="form-group">
            <label>${this.t('lbl_course_category')}</label>
            <select id="courseCategorySelect" class="form-control">
              <optgroup label="Drone / İHA Eğitimleri">
                <option value="İHA-0 (Temel Drone Ehliyeti)" ${course.category === 'İHA-0 (Temel Drone Ehliyeti)' ? 'selected' : ''}>İHA-0 — Temel Drone Ehliyeti</option>
                <option value="İHA-1 (Orta Sınıf Drone Ehliyeti)" ${course.category === 'İHA-1 (Orta Sınıf Drone Ehliyeti)' ? 'selected' : ''}>İHA-1 — Orta Sınıf Drone Ehliyeti</option>
                <option value="İHA-2 (Büyük İHA Ehliyeti)" ${course.category === 'İHA-2 (Büyük İHA Ehliyeti)' ? 'selected' : ''}>İHA-2 — Büyük İHA Ehliyeti</option>
                <option value="İHA-3 (İleri Endüstriyel Ehliyet)" ${course.category === 'İHA-3 (İleri Endüstriyel Ehliyet)' ? 'selected' : ''}>İHA-3 — İleri Endüstriyel Ehliyet</option>
              </optgroup>
              <optgroup label="Pilotaj (Uçak) Eğitimleri">
                <option value="PPL (Özel Pilot Lisansı)" ${course.category === 'PPL (Özel Pilot Lisansı)' ? 'selected' : ''}>PPL — Özel Pilot Lisansı</option>
                <option value="ATPL (Havayolu Taşımacılık Pilotu)" ${course.category === 'ATPL (Havayolu Taşımacılık Pilotu)' ? 'selected' : ''}>ATPL — Havayolu Taşımacılık Pilotu</option>
                <option value="CPL (Ticari Pilot Lisansı)" ${course.category === 'CPL (Ticari Pilot Lisansı)' ? 'selected' : ''}>CPL — Ticari Pilot Lisansı</option>
                <option value="NR (Gece Yetkisi)" ${course.category === 'NR (Gece Yetkisi)' ? 'selected' : ''}>NR — Gece Yetkisi</option>
                <option value="PIC (Sorumlu Pilot Uçuşu)" ${course.category === 'PIC (Sorumlu Pilot Uçuşu)' ? 'selected' : ''}>PIC — Sorumlu Pilot Uçuşu</option>
                <option value="IR (Aletli Uçuş Yetkisi)" ${course.category === 'IR (Aletli Uçuş Yetkisi)' ? 'selected' : ''}>IR — Aletli Uçuş Yetkisi</option>
                <option value="ME (Çok Motor Yetkisi)" ${course.category === 'ME (Çok Motor Yetkisi)' ? 'selected' : ''}>ME — Çok Motor Yetkisi</option>
                <option value="MCC (Çoklu Mürettebat İşbirliği)" ${course.category === 'MCC (Çoklu Mürettebat İşbirliği)' ? 'selected' : ''}>MCC — Çoklu Mürettebat İşbirliği</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>${this.t('lbl_course_status')}</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="courseStatus" value="Published" ${course.status === 'Published' ? 'checked' : ''}> Published (${this.t('status_Published')})
            </label>
            <label class="radio-label">
              <input type="radio" name="courseStatus" value="Draft" ${course.status === 'Draft' ? 'checked' : ''}> Draft (${this.t('status_Draft')})
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>${this.t('lbl_course_excerpt')}</label>
          <textarea id="courseExcerptInput" class="form-control">${course.excerpt}</textarea>
        </div>

        <div class="form-section-title" style="margin-top:30px;">${this.t('sec_logistics')}</div>
        <div class="form-grid-3">
          <div class="form-group">
            <label>${this.t('lbl_duration')}</label>
            <input type="text" id="courseDurationInput" class="form-control" value="${course.duration}" placeholder="Örn: 36 Saat / 4 Hafta">
          </div>
          <div class="form-group">
            <label>${this.t('lbl_capacity')}</label>
            <input type="number" id="courseCapacityInput" class="form-control" value="${course.capacity}">
          </div>
          <div class="form-group">
            <label>${this.t('lbl_tuition_fee')}</label>
            <input type="text" id="courseFeeInput" class="form-control" value="${course.fee}" placeholder="Örn: ₺14.500">
          </div>
        </div>
        <div class="form-group">
          <label>${this.t('lbl_next_start_date')}</label>
          <input type="text" id="courseDateInput" class="form-control" value="${course.nextDate}" placeholder="Örn: 2026-09-01 veya Esnek">
        </div>

        <div class="form-section-title" style="margin-top:30px;">${this.t('sec_syllabus')}</div>
        <div class="wysiwyg-wrapper">
          <div class="wysiwyg-toolbar">
            <button class="wysiwyg-btn" onclick="app.execFormat('bold')"><b>B</b></button>
            <button class="wysiwyg-btn" onclick="app.execFormat('italic')"><i>I</i></button>
            <button class="wysiwyg-btn" onclick="app.execFormat('insertUnorderedList')">• Bullet List</button>
            <button class="wysiwyg-btn" onclick="app.execFormat('insertOrderedList')">1. Numbered List</button>
            <button class="wysiwyg-btn" onclick="app.execFormat('createLink')">🔗 Link</button>
            <button class="wysiwyg-btn" onclick="app.execFormat('removeFormat')">Clear Format</button>
          </div>
          <div id="courseWysiwygEditor" class="wysiwyg-content" contenteditable="true">${course.description}</div>
        </div>

        <div class="form-section-title" style="margin-top:30px;">${this.t('sec_media')}</div>
        <div class="dropzone-area" onclick="document.getElementById('courseMediaFile').click()">
          <div class="dropzone-icon">📁</div>
          <div class="dropzone-text">${this.t('drop_course_media')}</div>
          <input type="file" id="courseMediaFile" style="display:none;" onchange="app.showToast('File added to queue')">
        </div>
      </div>

      <div class="sticky-footer-bar">
        <div>
          ${courseId ? `
            <button class="btn btn-danger" onclick="app.promptDeleteCourse('${course.id}')">${this.t('btn_delete_course')}</button>
          ` : ''}
        </div>
        <div style="display:flex; gap:12px;">
          <button class="btn btn-secondary" onclick="app.navigateToView('courses')">${this.t('btn_cancel')}</button>
          <button class="btn btn-secondary" onclick="app.saveCourseForm('Draft')">${this.t('btn_save_draft')}</button>
          <button class="btn btn-primary" onclick="app.saveCourseForm('Published')">${this.t('btn_save_publish')}</button>
        </div>
      </div>
    `;
  }

  execFormat(cmd) {
    if (cmd === 'createLink') {
      const url = prompt('URL giriniz:');
      if (url) document.execCommand(cmd, false, url);
    } else {
      document.execCommand(cmd, false, null);
    }
  }

  async saveCourseForm(status) {
    const title = document.getElementById('courseTitleInput').value.trim();
    if (!title) {
      this.showToast('Lütfen ders başlığı giriniz!', 'danger');
      return;
    }

    const category = document.getElementById('courseCategorySelect').value;
    const excerpt = document.getElementById('courseExcerptInput').value;
    const duration = document.getElementById('courseDurationInput').value;
    const capacity = document.getElementById('courseCapacityInput').value;
    const fee = document.getElementById('courseFeeInput').value;
    const nextDate = document.getElementById('courseDateInput').value;
    const description = document.getElementById('courseWysiwygEditor').innerHTML;

    const courseData = {
      id: this.editingCourseId,
      titleTR: title,
      category,
      duration,
      capacity: parseInt(capacity) || 20,
      fee,
      nextDate,
      status,
      excerpt,
      description
    };

    await this.storage.saveItem('courses', `${courseData.id}.json`, courseData);
    this.showToast(`Course saved successfully as ${status}!`, 'success');
    this.navigateToView('courses');
  }

  promptDeleteCourse(courseId) {
    this.openModal(
      this.t('btn_delete_course'),
      this.t('modal_undone'),
      async () => {
        await this.storage.deleteItem('courses', `${courseId}.json`, courseId);
        this.closeModal();
        this.showToast('Course deleted permanently.', 'danger');
        this.navigateToView('courses');
      }
    );
  }

  // ----------------------------------------------------
  // NEWS & ARTICLE EDITOR (SCREEN E) WITH PER-COLUMN FILTERING
  // ----------------------------------------------------
  async renderNewsView(container) {
    const news = (await this.storage.listCollection('news')) || [];
    const filters = this.columnFilters['news'] || {};
    const hasActiveFilters = Object.keys(filters).length > 0;

    // Multi-Column Filtering Engine
    const filteredNews = news.filter(item => {
      if (filters.title && !item.titleTR.toLowerCase().includes(filters.title.toLowerCase())) return false;
      if (filters.category && filters.category !== 'ALL' && !item.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
      if (filters.author && !item.author.toLowerCase().includes(filters.author.toLowerCase())) return false;
      if (filters.date && !item.date.toLowerCase().includes(filters.date.toLowerCase())) return false;
      if (filters.status && filters.status !== 'ALL' && item.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      return true;
    });

    container.innerHTML = `
      <div class="page-top-bar">
        <div class="page-title-group">
          <h1>📰 ${this.t('nav_news')}</h1>
          <p>${this.t('dash_desc')} (${this.t('lbl_filtered_count')} ${filteredNews.length} / ${news.length})</p>
        </div>
        <div style="display:flex; gap:12px;">
          ${hasActiveFilters ? `
            <button class="btn btn-secondary" onclick="app.clearColumnFilters('news')" style="color:var(--admin-accent-primary); font-weight:800;">
              ${this.t('btn_clear_filters')}
            </button>
          ` : ''}
          <button class="btn btn-primary" onclick="app.navigateToView('news-editor')">${this.t('btn_new_news')}</button>
        </div>
      </div>

      <div class="inbox-panel">
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>${this.t('col_title')}</th>
                <th>${this.t('col_category')}</th>
                <th>${this.t('col_author')}</th>
                <th>${this.t('col_date')}</th>
                <th>${this.t('col_status')}</th>
                <th>${this.t('col_action')}</th>
              </tr>
              <!-- Column Filter Bar Row -->
              <tr class="filter-header-row">
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.title || ''}" oninput="app.setColumnFilter('news', 'title', this.value)">
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('news', 'category', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="Akademi" ${filters.category === 'Akademi' ? 'selected' : ''}>Akademi</option>
                    <option value="Drone / İHA" ${filters.category === 'Drone / İHA' ? 'selected' : ''}>Drone / İHA</option>
                    <option value="Sivil Havacılık" ${filters.category === 'Sivil Havacılık' ? 'selected' : ''}>Sivil Havacılık</option>
                    <option value="Duyuru" ${filters.category === 'Duyuru' ? 'selected' : ''}>Duyuru</option>
                    <option value="Eğitim & Teknolojiler" ${filters.category === 'Eğitim & Teknolojiler' ? 'selected' : ''}>Eğitim & Teknolojiler</option>
                  </select>
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.author || ''}" oninput="app.setColumnFilter('news', 'author', this.value)">
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.date || ''}" oninput="app.setColumnFilter('news', 'date', this.value)">
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('news', 'status', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="Published" ${filters.status === 'Published' ? 'selected' : ''}>Published (${this.t('status_Published')})</option>
                    <option value="Draft" ${filters.status === 'Draft' ? 'selected' : ''}>Draft (${this.t('status_Draft')})</option>
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${filteredNews.length > 0 ? filteredNews.map(n => `
                <tr>
                  <td><strong>${n.titleTR}</strong></td>
                  <td>${n.category}</td>
                  <td>${n.author}</td>
                  <td>${n.date}</td>
                  <td><span class="badge-status badge-${n.status.toLowerCase()}">${this.t('status_' + n.status)}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="app.navigateToView('news-editor', {newsId:${n.id}})">${this.t('edit')}</button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="6" style="text-align:center; padding:32px; color:var(--admin-text-muted);">
                    Filtrelere uygun haber kaydı bulunamadı.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async renderNewsEditor(container, newsId = null) {
    let article = {
      id: Date.now(),
      titleTR: '',
      category: 'Drone / İHA',
      author: 'Ahmet Yılmaz',
      date: new Date().toISOString().substring(0, 10),
      status: 'Draft',
      summaryTR: '',
      body: ''
    };

    if (newsId) {
      const news = (await this.storage.listCollection('news')) || [];
      const found = news.find(n => n.id == newsId);
      if (found) article = found;
    }

    this.editingNewsId = article.id;

    container.innerHTML = `
      <div class="page-top-bar">
        <div class="page-title-group">
          <a href="#news" onclick="app.navigateToView('news')" style="color:var(--admin-text-muted); font-size:0.85rem; text-decoration:none;">${this.t('btn_back_news')}</a>
          <h1 style="margin-top:6px;">${newsId ? this.t('title_edit_news') : this.t('title_create_news')}</h1>
        </div>
      </div>

      <div class="editor-container">
        <div class="form-section-title">${this.t('sec_article_details')}</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>${this.t('lbl_article_title')}</label>
            <input type="text" id="newsTitleInput" class="form-control" value="${article.titleTR}" placeholder="Örn: Sapmaz Academy Simülasyon Testleri Başladı">
          </div>
          <div class="form-group">
            <label>${this.t('lbl_site_category')}</label>
            <select id="newsCategorySelect" class="form-control">
              <option value="Akademi" ${article.category === 'Akademi' ? 'selected' : ''}>Akademi</option>
              <option value="Drone / İHA" ${article.category === 'Drone / İHA' ? 'selected' : ''}>Drone / İHA</option>
              <option value="Sivil Havacılık" ${article.category === 'Sivil Havacılık' ? 'selected' : ''}>Sivil Havacılık</option>
              <option value="Duyuru" ${article.category === 'Duyuru' ? 'selected' : ''}>Duyuru</option>
              <option value="Eğitim & Teknolojiler" ${article.category === 'Eğitim & Teknolojiler' ? 'selected' : ''}>Eğitim & Teknolojiler</option>
            </select>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>${this.t('lbl_author')}</label>
            <input type="text" id="newsAuthorInput" class="form-control" value="${article.author}">
          </div>
          <div class="form-group">
            <label>${this.t('lbl_publish_date')}</label>
            <input type="date" id="newsDateInput" class="form-control" value="${article.date}">
          </div>
          <div class="form-group">
            <label>${this.t('lbl_article_status')}</label>
            <div class="radio-group">
              <label class="radio-label"><input type="radio" name="newsStatus" value="Published" ${article.status === 'Published' ? 'checked' : ''}> Published (${this.t('status_Published')})</label>
              <label class="radio-label"><input type="radio" name="newsStatus" value="Draft" ${article.status === 'Draft' ? 'checked' : ''}> Draft (${this.t('status_Draft')})</label>
            </div>
          </div>
        </div>

        <div class="form-section-title" style="margin-top:30px;">${this.t('sec_article_summary')}</div>
        <div class="form-group">
          <label>${this.t('lbl_summary_desc')}</label>
          <textarea id="newsSummaryInput" class="form-control">${article.summaryTR}</textarea>
        </div>

        <div class="form-section-title" style="margin-top:30px;">${this.t('sec_article_body')}</div>
        <div class="wysiwyg-wrapper">
          <div class="wysiwyg-toolbar">
            <button class="wysiwyg-btn" onclick="app.execFormat('formatBlock')">H2 Heading</button>
            <button class="wysiwyg-btn" onclick="app.execFormat('bold')"><b>B</b></button>
            <button class="wysiwyg-btn" onclick="app.execFormat('italic')"><i>I</i></button>
            <button class="wysiwyg-btn" onclick="app.execFormat('insertUnorderedList')">• Bullet List</button>
            <button class="wysiwyg-btn" onclick="app.execFormat('createLink')">🔗 Link</button>
          </div>
          <div id="newsWysiwygEditor" class="wysiwyg-content" contenteditable="true">${article.body}</div>
        </div>

        <div class="form-section-title" style="margin-top:30px;">${this.t('sec_cover_image')}</div>
        <div class="dropzone-area" onclick="document.getElementById('newsCoverFile').click()">
          <div class="dropzone-icon">🖼️</div>
          <div class="dropzone-text">${this.t('drop_news_cover')}</div>
          <input type="file" id="newsCoverFile" style="display:none;" onchange="app.showToast('Cover image attached')">
        </div>
      </div>

      <div class="sticky-footer-bar">
        <div>
          ${newsId ? `
            <button class="btn btn-danger" onclick="app.promptDeleteNews('${article.id}')">${this.t('btn_delete_article')}</button>
          ` : ''}
        </div>
        <div style="display:flex; gap:12px;">
          <button class="btn btn-secondary" onclick="app.navigateToView('news')">${this.t('btn_cancel')}</button>
          <button class="btn btn-secondary" onclick="app.saveNewsForm('Draft')">${this.t('btn_save_draft')}</button>
          <button class="btn btn-primary" onclick="app.saveNewsForm('Published')">${this.t('btn_save_publish')}</button>
        </div>
      </div>
    `;
  }

  async saveNewsForm(status) {
    const title = document.getElementById('newsTitleInput').value.trim();
    if (!title) {
      this.showToast('Lütfen haber başlığı giriniz!', 'danger');
      return;
    }

    const category = document.getElementById('newsCategorySelect').value;
    const author = document.getElementById('newsAuthorInput').value;
    const date = document.getElementById('newsDateInput').value;
    const summaryTR = document.getElementById('newsSummaryInput').value;
    const body = document.getElementById('newsWysiwygEditor').innerHTML;

    const newsData = {
      id: this.editingNewsId,
      titleTR: title,
      category,
      author,
      date,
      status,
      summaryTR,
      body
    };

    await this.storage.saveItem('news', `${newsData.id}.json`, newsData);
    this.showToast(`News article saved successfully as ${status}!`, 'success');
    this.navigateToView('news');
  }

  promptDeleteNews(newsId) {
    this.openModal(
      this.t('btn_delete_article'),
      this.t('modal_undone'),
      async () => {
        await this.storage.deleteItem('news', `${newsId}.json`, newsId);
        this.closeModal();
        this.showToast('News article deleted.', 'danger');
        this.navigateToView('news');
      }
    );
  }

  // ----------------------------------------------------
  // RESOURCE POOL FILES EDITOR & CRUD (SCREEN F) WITH PER-COLUMN FILTERING
  // ----------------------------------------------------
  async renderResourcesView(container) {
    const resources = (await this.storage.listCollection('resources')) || [];
    const filters = this.columnFilters['resources'] || {};
    const hasActiveFilters = Object.keys(filters).length > 0;

    // Multi-Column Filtering Engine
    const filteredResources = resources.filter(item => {
      if (filters.title && !item.titleTR.toLowerCase().includes(filters.title.toLowerCase()) && !(item.titleEN && item.titleEN.toLowerCase().includes(filters.title.toLowerCase()))) return false;
      if (filters.category && filters.category !== 'ALL' && item.category.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.format && filters.format !== 'ALL' && item.format.toLowerCase() !== filters.format.toLowerCase()) return false;
      if (filters.size && item.fileSize && !item.fileSize.toLowerCase().includes(filters.size.toLowerCase())) return false;
      if (filters.date && !item.date.toLowerCase().includes(filters.date.toLowerCase())) return false;
      if (filters.status && filters.status !== 'ALL' && item.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      return true;
    });

    container.innerHTML = `
      <div class="page-top-bar">
        <div class="page-title-group">
          <h1>📁 ${this.t('nav_resources_admin')}</h1>
          <p>${this.t('dash_desc')} (${this.t('lbl_filtered_count')} ${filteredResources.length} / ${resources.length})</p>
        </div>
        <div style="display:flex; gap:12px;">
          ${hasActiveFilters ? `
            <button class="btn btn-secondary" onclick="app.clearColumnFilters('resources')" style="color:var(--admin-accent-primary); font-weight:800;">
              ${this.t('btn_clear_filters')}
            </button>
          ` : ''}
          <button class="btn btn-primary" onclick="app.navigateToView('resource-editor')">${this.t('btn_new_resource')}</button>
        </div>
      </div>

      <div class="inbox-panel">
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>${this.t('col_title')}</th>
                <th>${this.t('col_category')}</th>
                <th>${this.t('col_format')}</th>
                <th>${this.t('col_size')}</th>
                <th>${this.t('col_date')}</th>
                <th>${this.t('col_status')}</th>
                <th>${this.t('col_action')}</th>
              </tr>
              <!-- Column Filter Bar Row -->
              <tr class="filter-header-row">
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.title || ''}" oninput="app.setColumnFilter('resources', 'title', this.value)">
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('resources', 'category', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="directives" ${filters.category === 'directives' ? 'selected' : ''}>Directives</option>
                    <option value="regions" ${filters.category === 'regions' ? 'selected' : ''}>Bölgeler & NOTAM</option>
                    <option value="students" ${filters.category === 'students' ? 'selected' : ''}>Öğrenci Belgeleri</option>
                    <option value="hezarfen" ${filters.category === 'hezarfen' ? 'selected' : ''}>Hezarfen Portal</option>
                    <option value="faq" ${filters.category === 'faq' ? 'selected' : ''}>SSS (FAQ)</option>
                  </select>
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('resources', 'format', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="PDF Document" ${filters.format === 'PDF Document' ? 'selected' : ''}>PDF Document</option>
                    <option value="ZIP Archive" ${filters.format === 'ZIP Archive' ? 'selected' : ''}>ZIP Archive</option>
                    <option value="Direct Link" ${filters.format === 'Direct Link' ? 'selected' : ''}>Direct Link</option>
                    <option value="Interactive FAQ" ${filters.format === 'Interactive FAQ' ? 'selected' : ''}>Interactive FAQ</option>
                  </select>
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.size || ''}" oninput="app.setColumnFilter('resources', 'size', this.value)">
                </th>
                <th>
                  <input type="text" class="table-filter-control" placeholder="${this.t('filter_search')}" value="${filters.date || ''}" oninput="app.setColumnFilter('resources', 'date', this.value)">
                </th>
                <th>
                  <select class="table-filter-control" onchange="app.setColumnFilter('resources', 'status', this.value)">
                    <option value="ALL">${this.t('filter_all')}</option>
                    <option value="Published" ${filters.status === 'Published' ? 'selected' : ''}>Published (${this.t('status_Published')})</option>
                    <option value="Draft" ${filters.status === 'Draft' ? 'selected' : ''}>Draft (${this.t('status_Draft')})</option>
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${filteredResources.length > 0 ? filteredResources.map(r => `
                <tr>
                  <td><strong>${r.titleTR}</strong></td>
                  <td><span class="badge-status badge-info" style="text-transform:uppercase;">${r.category}</span></td>
                  <td>${r.format}</td>
                  <td>${r.fileSize || 'Auto'}</td>
                  <td>${r.date}</td>
                  <td><span class="badge-status badge-${r.status.toLowerCase()}">${this.t('status_' + r.status)}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="app.navigateToView('resource-editor', {resourceId:'${r.id}'})">${this.t('edit')}</button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" style="text-align:center; padding:32px; color:var(--admin-text-muted);">
                    Filtrelere uygun kaynak belgesi bulunamadı.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async renderResourceEditor(container, resourceId = null) {
    let resource = {
      id: 'res-' + Date.now(),
      titleTR: '',
      titleEN: '',
      category: 'directives',
      format: 'PDF Document',
      fileSize: '2.5 MB',
      fileUrl: '',
      date: new Date().toISOString().substring(0, 10),
      status: 'Published',
      descriptionTR: ''
    };

    if (resourceId) {
      const resources = (await this.storage.listCollection('resources')) || [];
      const found = resources.find(r => r.id === resourceId);
      if (found) resource = found;
    }

    this.editingResourceId = resource.id;

    container.innerHTML = `
      <div class="page-top-bar">
        <div class="page-title-group">
          <a href="#resources" onclick="app.navigateToView('resources')" style="color:var(--admin-text-muted); font-size:0.85rem; text-decoration:none;">${this.t('btn_back_resources')}</a>
          <h1 style="margin-top:6px;">${resourceId ? this.t('title_edit_resource') : this.t('title_create_resource')}</h1>
        </div>
      </div>

      <div class="editor-container">
        <div class="form-section-title">${this.t('sec_resource_ident')}</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>${this.t('lbl_res_title_tr')}</label>
            <input type="text" id="resTitleInputTR" class="form-control" value="${resource.titleTR}" placeholder="Örn: SHGM İHA Talimatı (SHT-İHA)">
          </div>
          <div class="form-group">
            <label>${this.t('lbl_res_title_en')}</label>
            <input type="text" id="resTitleInputEN" class="form-control" value="${resource.titleEN || ''}" placeholder="Örn: DGCA UAV Directive (SHT-UAV)">
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>${this.t('lbl_target_tab')}</label>
            <select id="resCategorySelect" class="form-control" onchange="app.updateResourceMetadataFromCategory(this.value)">
              <option value="directives" ${resource.category === 'directives' ? 'selected' : ''}>Havacılık Talimatları (Directives)</option>
              <option value="regions" ${resource.category === 'regions' ? 'selected' : ''}>Bölgeler & NOTAM (Airspace / NOTAMs)</option>
              <option value="students" ${resource.category === 'students' ? 'selected' : ''}>Öğrenci Dokümanları (Student Files)</option>
              <option value="hezarfen" ${resource.category === 'hezarfen' ? 'selected' : ''}>Hezarfen Portal (Airfield Info)</option>
              <option value="faq" ${resource.category === 'faq' ? 'selected' : ''}>Sıkça Sorulan Sorular (FAQ Item)</option>
            </select>
          </div>

          <div class="form-group">
            <label>${this.t('lbl_article_status')}</label>
            <div class="radio-group">
              <label class="radio-label"><input type="radio" name="resStatus" value="Published" ${resource.status === 'Published' ? 'checked' : ''}> Published (${this.t('status_Published')})</label>
              <label class="radio-label"><input type="radio" name="resStatus" value="Draft" ${resource.status === 'Draft' ? 'checked' : ''}> Draft (${this.t('status_Draft')})</label>
            </div>
          </div>
        </div>

        <!-- Read-Only Auto-Extracted Metadata Card -->
        <div style="background:var(--admin-bg-light); border:1px solid var(--admin-border); padding:16px 20px; border-radius:10px; margin:20px 0; display:flex; gap:32px; align-items:center;">
          <div>
            <div style="font-size:0.75rem; font-weight:800; color:var(--admin-text-muted); text-transform:uppercase;">${this.t('lbl_auto_format')}</div>
            <div id="resAutoFormatBadge" style="font-size:1.05rem; font-weight:800; color:var(--admin-accent-primary); margin-top:4px;">${resource.format || 'Auto-Detecting...'}</div>
          </div>
          <div style="width:1px; height:32px; background:var(--admin-border);"></div>
          <div>
            <div style="font-size:0.75rem; font-weight:800; color:var(--admin-text-muted); text-transform:uppercase;">${this.t('lbl_auto_size')}</div>
            <div id="resAutoFileSizeBadge" style="font-size:1.05rem; font-weight:800; color:var(--admin-text-main); margin-top:4px;">${resource.fileSize || 'Auto-Detecting...'}</div>
          </div>
        </div>

        <div class="form-group">
          <label>${this.t('lbl_file_url')}</label>
          <input type="text" id="resFileUrlInput" class="form-control" value="${resource.fileUrl}" placeholder="Örn: ../assets/docs/sht_iha.pdf veya https://..." oninput="app.updateResourceMetadataFromUrl(this.value)">
        </div>

        <div class="form-section-title" style="margin-top:30px;">${this.t('sec_res_desc')}</div>
        <div class="form-group">
          <label>${this.t('lbl_res_desc_text')}</label>
          <textarea id="resDescInput" class="form-control" style="min-height:100px;">${resource.descriptionTR}</textarea>
        </div>

        <div class="form-section-title" style="margin-top:30px;">${this.t('sec_res_drop')}</div>
        <div class="dropzone-area" onclick="document.getElementById('resFileDrop').click()">
          <div class="dropzone-icon">📥</div>
          <div class="dropzone-text">${this.t('drop_res_file')}</div>
          <input type="file" id="resFileDrop" style="display:none;" onchange="app.handleResourceFileSelected(event)">
        </div>
      </div>

      <div class="sticky-footer-bar">
        <div>
          ${resourceId ? `
            <button class="btn btn-danger" onclick="app.promptDeleteResource('${resource.id}')">${this.t('btn_delete_resource')}</button>
          ` : ''}
        </div>
        <div style="display:flex; gap:12px;">
          <button class="btn btn-secondary" onclick="app.navigateToView('resources')">${this.t('btn_cancel')}</button>
          <button class="btn btn-secondary" onclick="app.saveResourceForm('Draft')">${this.t('btn_save_draft')}</button>
          <button class="btn btn-primary" onclick="app.saveResourceForm('Published')">${this.t('btn_save_publish')}</button>
        </div>
      </div>
    `;
  }

  handleResourceFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    let formattedSize = '';
    if (file.size >= 1024 * 1024) {
      formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    } else {
      formattedSize = (file.size / 1024).toFixed(0) + ' KB';
    }

    const ext = file.name.split('.').pop().toLowerCase();
    let format = 'PDF Document';
    if (ext === 'pdf') format = 'PDF Document';
    else if (['zip', 'rar', '7z', 'gz'].includes(ext)) format = 'ZIP Archive';
    else if (['doc', 'docx'].includes(ext)) format = 'Word Document';
    else if (['xls', 'xlsx'].includes(ext)) format = 'Excel Sheet';
    else if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) format = 'Image Asset';

    const formatBadge = document.getElementById('resAutoFormatBadge');
    const sizeBadge = document.getElementById('resAutoFileSizeBadge');
    const urlInput = document.getElementById('resFileUrlInput');

    if (formatBadge) formatBadge.textContent = format;
    if (sizeBadge) sizeBadge.textContent = formattedSize;
    if (urlInput && !urlInput.value) {
      urlInput.value = `../assets/docs/${file.name}`;
    }

    this.showToast(`File selected: ${file.name} (${formattedSize}) - Format: ${format}`, 'success');
  }

  updateResourceMetadataFromUrl(url) {
    const formatBadge = document.getElementById('resAutoFormatBadge');
    const sizeBadge = document.getElementById('resAutoFileSizeBadge');
    if (!formatBadge || !sizeBadge) return;

    const lower = url.toLowerCase().trim();
    if (lower.startsWith('http://') || lower.startsWith('https://')) {
      formatBadge.textContent = 'Direct Link';
      sizeBadge.textContent = 'External Web Link';
    } else if (lower.startsWith('#faq') || document.getElementById('resCategorySelect').value === 'faq') {
      formatBadge.textContent = 'Interactive FAQ';
      sizeBadge.textContent = 'Web Content';
    } else if (lower.endsWith('.pdf')) {
      formatBadge.textContent = 'PDF Document';
      if (sizeBadge.textContent === 'Auto-Detecting...' || sizeBadge.textContent === 'External Web Link') {
        sizeBadge.textContent = '2.5 MB';
      }
    } else if (lower.endsWith('.zip') || lower.endsWith('.rar')) {
      formatBadge.textContent = 'ZIP Archive';
      if (sizeBadge.textContent === 'Auto-Detecting...') {
        sizeBadge.textContent = '5.0 MB';
      }
    }
  }

  updateResourceMetadataFromCategory(cat) {
    if (cat === 'faq') {
      const formatBadge = document.getElementById('resAutoFormatBadge');
      const sizeBadge = document.getElementById('resAutoFileSizeBadge');
      if (formatBadge) formatBadge.textContent = 'Interactive FAQ';
      if (sizeBadge) sizeBadge.textContent = 'Web Content';
    }
  }

  async saveResourceForm(status) {
    const titleTR = document.getElementById('resTitleInputTR').value.trim();
    if (!titleTR) {
      this.showToast('Lütfen kaynak başlığı giriniz!', 'danger');
      return;
    }

    const titleEN = document.getElementById('resTitleInputEN').value;
    const category = document.getElementById('resCategorySelect').value;
    const format = document.getElementById('resAutoFormatBadge').textContent || 'PDF Document';
    const fileSize = document.getElementById('resAutoFileSizeBadge').textContent || '2.5 MB';
    const fileUrl = document.getElementById('resFileUrlInput').value;
    const descriptionTR = document.getElementById('resDescInput').value;

    const resourceData = {
      id: this.editingResourceId,
      titleTR,
      titleEN,
      category,
      format,
      fileSize,
      fileUrl,
      date: new Date().toISOString().substring(0, 10),
      status,
      descriptionTR
    };

    await this.storage.saveItem('resources', `${resourceData.id}.json`, resourceData);
    this.showToast(`Resource document saved successfully as ${status}!`, 'success');
    this.navigateToView('resources');
  }

  promptDeleteResource(resourceId) {
    this.openModal(
      this.t('btn_delete_resource'),
      this.t('modal_undone'),
      async () => {
        await this.storage.deleteItem('resources', `${resourceId}.json`, resourceId);
        this.closeModal();
        this.showToast('Resource file deleted permanently.', 'danger');
        this.navigateToView('resources');
      }
    );
  }

  // ----------------------------------------------------
  // SETTINGS & SYSTEM (SCREEN G)
  // ----------------------------------------------------
  renderSettingsView(container) {
    container.innerHTML = `
      <div class="page-top-bar">
        <div class="page-title-group">
          <h1>⚙️ ${this.t('nav_settings')}</h1>
          <p>${this.t('dash_desc')}</p>
        </div>
      </div>

      <div class="editor-container">
        <div class="form-section-title">${this.t('sec_storage_engine')}</div>
        <div class="form-group">
          <label>${this.t('lbl_storage_mode')}</label>
          <input type="text" class="form-control" value="${this.storage.isLocal ? this.t('mode_local') : this.t('mode_github')}" readonly style="font-weight:700; color:var(--admin-accent-primary);">
        </div>

        <div class="form-grid-2" style="margin-top:16px;">
          <div class="form-group">
            <label>GitHub Kullanıcı Adı / Organizasyon (Owner) *</label>
            <input type="text" id="gitOwnerInput" class="form-control" value="${this.storage.owner}" placeholder="Örn: sapmaz-academy veya kullanıcı adınız">
          </div>
          <div class="form-group">
            <label>GitHub Depo Adı (Repository) *</label>
            <input type="text" id="gitRepoInput" class="form-control" value="${this.storage.repo}" placeholder="Örn: sapmaz-website veya repo adınız">
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Hedef Dal (Branch)</label>
            <input type="text" id="gitBranchInput" class="form-control" value="${this.storage.branch}" placeholder="Örn: main veya master">
          </div>
          <div class="form-group">
            <label>${this.t('lbl_git_token')}</label>
            <input type="password" id="gitTokenInput" class="form-control" value="${this.storage.token}" placeholder="ghp_xxxxxxxxxxxx">
          </div>
        </div>

        <div style="margin-top:20px;">
          <button class="btn btn-primary" onclick="app.saveSettings()">${this.t('btn_save_config')}</button>
        </div>
      </div>
    `;
  }

  saveSettings() {
    const owner = document.getElementById('gitOwnerInput').value.trim();
    const repo = document.getElementById('gitRepoInput').value.trim();
    const branch = document.getElementById('gitBranchInput').value.trim();
    const token = document.getElementById('gitTokenInput').value.trim();

    this.storage.setConfig({ owner, repo, branch, token });

    if (token) {
      this.showToast(`GitHub Token saved for repo ${this.storage.owner}/${this.storage.repo} (${this.storage.branch}). Live GitHub API Mode Active!`, 'success');
    } else {
      this.showToast('Switched to Local Storage Test Mode.', 'success');
    }
    this.renderCurrentView();
  }

  // ----------------------------------------------------
  // GLOBAL SEARCH & NOTIFICATIONS
  // ----------------------------------------------------
  async handleGlobalSearch(query) {
    const resultsContainer = document.getElementById('globalSearchResults');
    if (!resultsContainer) return;

    if (!query || query.trim().length < 2) {
      resultsContainer.classList.remove('active');
      return;
    }

    const q = query.toLowerCase().trim();
    const apps = (await this.storage.listCollection('applications')) || [];
    const contacts = (await this.storage.listCollection('contacts')) || [];
    const courses = (await this.storage.listCollection('courses')) || [];
    const news = (await this.storage.listCollection('news')) || [];
    const resources = (await this.storage.listCollection('resources')) || [];

    const matchedApps = apps.filter(a => a.name.toLowerCase().includes(q) || a.course.toLowerCase().includes(q));
    const matchedContacts = contacts.filter(c => c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q));
    const matchedCourses = courses.filter(c => c.titleTR.toLowerCase().includes(q));
    const matchedNews = news.filter(n => n.titleTR.toLowerCase().includes(q));
    const matchedResources = resources.filter(r => r.titleTR.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));

    let html = '';
    if (matchedApps.length > 0) {
      html += `<div class="search-result-group-title">${this.t('nav_applications')}</div>`;
      matchedApps.forEach(a => {
        html += `<div class="search-result-item" onclick="app.openApplicationDrawer('${a.id}'); app.hideSearch();">
          <div><div class="search-result-title">${a.name}</div><div class="search-result-sub">${a.course}</div></div>
          <span class="badge-status badge-${a.status.toLowerCase().replace(' ','')}">${this.t('status_' + a.status)}</span>
        </div>`;
      });
    }

    if (matchedContacts.length > 0) {
      html += `<div class="search-result-group-title">${this.t('nav_contacts')}</div>`;
      matchedContacts.forEach(c => {
        html += `<div class="search-result-item" onclick="app.openContactDrawer('${c.id}'); app.hideSearch();">
          <div><div class="search-result-title">${c.name}</div><div class="search-result-sub">${c.subject}</div></div>
          <span class="badge-status badge-${c.status.toLowerCase()}">${this.t('status_' + c.status)}</span>
        </div>`;
      });
    }

    if (matchedCourses.length > 0) {
      html += `<div class="search-result-group-title">${this.t('nav_courses')}</div>`;
      matchedCourses.forEach(c => {
        html += `<div class="search-result-item" onclick="app.navigateToView('course-editor', {courseId:'${c.id}'}); app.hideSearch();">
          <div><div class="search-result-title">${c.titleTR}</div><div class="search-result-sub">${c.category}</div></div>
        </div>`;
      });
    }

    if (matchedNews.length > 0) {
      html += `<div class="search-result-group-title">${this.t('nav_news')}</div>`;
      matchedNews.forEach(n => {
        html += `<div class="search-result-item" onclick="app.navigateToView('news-editor', {newsId:${n.id}}); app.hideSearch();">
          <div><div class="search-result-title">${n.titleTR}</div><div class="search-result-sub">${n.category}</div></div>
        </div>`;
      });
    }

    if (matchedResources.length > 0) {
      html += `<div class="search-result-group-title">${this.t('nav_resources_admin')}</div>`;
      matchedResources.forEach(r => {
        html += `<div class="search-result-item" onclick="app.navigateToView('resource-editor', {resourceId:'${r.id}'}); app.hideSearch();">
          <div><div class="search-result-title">${r.titleTR}</div><div class="search-result-sub">${r.category} • ${r.format}</div></div>
        </div>`;
      });
    }

    if (!html) {
      html = `<div style="padding:16px; text-align:center; font-size:0.85rem; color:var(--admin-text-muted);">No matching records found.</div>`;
    }

    resultsContainer.innerHTML = html;
    resultsContainer.classList.add('active');
  }

  hideSearch() {
    const resultsContainer = document.getElementById('globalSearchResults');
    if (resultsContainer) resultsContainer.classList.remove('active');
  }

  async updateNotificationBadges() {
    const apps = (await this.storage.listCollection('applications')) || [];
    const contacts = (await this.storage.listCollection('contacts')) || [];

    const unreadApps = apps.filter(a => a.status === 'New').length;
    const unreadContacts = contacts.filter(c => c.status === 'Unread').length;

    const totalUnread = unreadApps + unreadContacts;
    const notifBadge = document.getElementById('notifCountBadge');
    if (notifBadge) {
      notifBadge.textContent = totalUnread;
      notifBadge.style.display = totalUnread > 0 ? 'inline-block' : 'none';
    }

    const appNavBadge = document.getElementById('appNavUnreadBadge');
    if (appNavBadge) {
      appNavBadge.textContent = unreadApps;
      appNavBadge.style.display = unreadApps > 0 ? 'inline-block' : 'none';
    }

    const contactNavBadge = document.getElementById('contactNavUnreadBadge');
    if (contactNavBadge) {
      contactNavBadge.textContent = unreadContacts;
      contactNavBadge.style.display = unreadContacts > 0 ? 'inline-block' : 'none';
    }
  }

  openModal(title, desc, confirmCallback) {
    const modalBackdrop = document.getElementById('modalBackdrop');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent = desc;

    const confirmBtn = document.getElementById('modalConfirmBtn');
    confirmBtn.onclick = confirmCallback;

    modalBackdrop.classList.add('active');
  }

  closeModal() {
    const modalBackdrop = document.getElementById('modalBackdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('active');
  }

  showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠️'}</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new AdminApp();
});
