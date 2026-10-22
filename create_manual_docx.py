# -*- coding: utf-8 -*-
"""
Script to generate the comprehensive Word manual (.docx) for Artisanal Pastry Website.
Includes full documentation, credentials, SEO guides, product management, cake customizer, etc.
"""
import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_manual():
    doc = Document()

    # Base page setup (A4 with 1 inch margins)
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Tahoma'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(45, 35, 25)

    # Document Header / Cover Title
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_p.paragraph_format.space_before = Pt(10)
    title_p.paragraph_format.space_after = Pt(4)
    run_icon = title_p.add_run("🧁 📖\n")
    run_icon.font.size = Pt(28)
    run_title = title_p.add_run("راهنمای جامع کاربری و مدیریت سامانه قنادی فاخر")
    run_title.font.name = 'Tahoma'
    run_title.font.size = Pt(20)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(184, 134, 11) # Gold

    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_p.paragraph_format.space_after = Pt(20)
    run_sub = sub_p.add_run("مستندات کامل کار با وب‌سایت، پنل مدیریت، بهینه‌سازی سئو (SEO)، تنظیمات قیمت و سفارشات")
    run_sub.font.name = 'Tahoma'
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = RGBColor(100, 90, 80)

    # Insert Hero Image if available
    img_path = r"C:\Users\PADIDAR\.gemini\antigravity-ide\scratch\artisanal-pastry\assets\images\pastry_hero.jpg"
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_after = Pt(20)
        p_img.add_run().add_picture(img_path, width=Inches(5.5))

    # Helper function for adding styled Persian sections
    def add_section_header(title, emoji="✨"):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(18)
        h.paragraph_format.space_after = Pt(6)
        r = h.add_run(f"{emoji} {title}")
        r.font.name = 'Tahoma'
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = RGBColor(146, 64, 14) # Amber 800

    def add_p(text, bold=False, color=None, space_after=6):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.3
        r = p.add_run(text)
        r.font.name = 'Tahoma'
        r.font.size = Pt(10)
        if bold:
            r.font.bold = True
        if color:
            r.font.color.rgb = color
        return p

    def add_callout(text, title="نکته مهم", bg_hex="FFFBEB", border_color="F59E0B"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.6)
        set_cell_background(cell, bg_hex)
        set_cell_margins(cell, top=160, bottom=160, left=220, right=220)

        cp = cell.paragraphs[0]
        cp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        cp.paragraph_format.space_after = Pt(4)
        cr_title = cp.add_run(f"📌 {title}:\n")
        cr_title.font.name = 'Tahoma'
        cr_title.font.size = Pt(10.5)
        cr_title.font.bold = True
        cr_title.font.color.rgb = RGBColor(180, 83, 9)

        cr_text = cp.add_run(text)
        cr_text.font.name = 'Tahoma'
        cr_text.font.size = Pt(9.5)
        cr_text.font.color.rgb = RGBColor(120, 53, 15)

        # Empty paragraph for spacing
        p_space = doc.add_paragraph()
        p_space.paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # SECTION 1: System Overview
    # -------------------------------------------------------------
    add_section_header("۱. معرفی کلی سامانه و معماری فروشگاه", "🏛️")
    add_p("وب‌سایت قنادی و شیرینی‌سرای فاخر، یک پلتفرم فوق‌لوکس و مدرن برای معرفی و فروش انواع شیرینی‌های اصیل، کیک‌های اختصاصی، دسرهای بین‌المللی و خدمات تشریفات مجالس است.")
    add_p("این سامانه شامل بخش‌های عمومی (صفحه اصلی، کاتالوگ محصولات با ۱۲ دسته‌بندی، سفارش آنلاین کیک با محاسبه‌گر هوشمند، تشریفات مجالس، درباره ما و شعبات) و بخش اختصاصی پنل مدیریت قدرتمند می‌باشد.")

    # -------------------------------------------------------------
    # SECTION 2: Security & Credentials (Private info not displayed on site)
    # -------------------------------------------------------------
    add_section_header("۲. مشخصات ورود محرمانه و حساب‌های کاربری پیش‌فرض", "🔐")
    add_p("جهت حفظ امنیت کامل و جلوگیری از هرگونه نفوذ، تمامی راهنماها و مقادیر پیش‌فرض رمز و نام کاربری از محیط عمومی سایت و کادرهای ورود حذف شده‌اند. اطلاعات ورود اولیه به شرح زیر می‌باشد:")

    # Table of credentials
    t_cred = doc.add_table(rows=3, cols=4)
    t_cred.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["نام کاربری", "نقش کاربری", "رمز عبور پیش‌فرض", "سطح دسترسی"]
    for i, h in enumerate(headers):
        cell = t_cred.cell(0, i)
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_cell_background(cell, "FEF3C7")
        set_cell_margins(cell, 120, 120, 120, 120)
        r = cell.paragraphs[0].add_run(h)
        r.font.name = 'Tahoma'
        r.font.bold = True
        r.font.size = Pt(9.5)

    data_cred = [
        ("ceo", "مدیر ارشد و موسس (CEO)", "123", "دسترسی کامل و نامحدود، مدیریت تمام ادمین‌ها، تنظیمات سئو، محصولات و سفارشات"),
        ("admin", "مدیر داخلی و شعبات (Admin)", "123", "مدیریت قیمت‌ها، محصولات، بررسی و تایید سفارشات کیک و مجالس")
    ]
    for row_idx, row_data in enumerate(data_cred, start=1):
        for col_idx, text in enumerate(row_data):
            cell = t_cred.cell(row_idx, col_idx)
            cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER if col_idx in [0, 2] else WD_ALIGN_PARAGRAPH.RIGHT
            set_cell_background(cell, "FFFFFF" if row_idx % 2 == 1 else "F9FAFB")
            set_cell_margins(cell, 100, 100, 100, 100)
            r = cell.paragraphs[0].add_run(text)
            r.font.name = 'Tahoma'
            r.font.size = Pt(9)
            if col_idx in [0, 2]:
                r.font.bold = True
                r.font.color.rgb = RGBColor(184, 134, 11)

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_after = Pt(6)

    add_callout(
        "برای ورود ادمین و پرسنل، نیاز به هیچ دکمه آشکاری در سایت نیست. در پاپ‌آپ ورود کاربر عادی، کافی است در فیلد شماره همراه، یکی از کلمات کلیدی ورود (مانند ceo، admin، مدیریت، پرسنل) تایپ شود تا کادر امنیتی ورود مدیریت فعال شود.\nهمچنین مدیر ارشد (CEO) می‌تواند این کلمات کلیدی را در تب مدیریت پرسنل به کلمات دلخواه تغییر دهد.",
        "روش ورود مخفی پرسنل (Secret Staff Trigger)",
        "EFF6FF",
        "3B82F6"
    )

    # -------------------------------------------------------------
    # SECTION 3: SEO Optimization System
    # -------------------------------------------------------------
    add_section_header("۳. راهنمای جامع بهینه‌سازی موتورهای جستجو (SEO)", "🌐")
    add_p("بخش سئو وب‌سایت در دو سطح طراحی شده است: سئوی سراسری وب‌سایت (Global SEO) و سئوی اختصاصی برای هر محصول (Product SEO).")

    add_p("الف) بخش‌های کلیدی سئو در هر محصول:", bold=True, color=RGBColor(184, 134, 11))
    add_p("۱. تیتر سئو (نوشته بزرگ‌تر بالایی در گوگل - SEO Meta Title):\nاین عنوان همان خط درشت آبی رنگی است که کاربر هنگام سرچ در گوگل می‌بیند. باید جذاب، شامل نام محصول و نام برند باشد (طول ایده‌آل: ۵۰ تا ۶۰ کاراکتر).")
    add_p("۲. اسلاگ آدرس (URL Slug):\nنامک انگلیسی یا فارسی است که در انتهای آدرس مرورگر قرار می‌گیرد (مثال: pistachio-croissant). اسلاگ‌های با معنی و تمیز رتبه سایت را به شدت بالا می‌برند.")
    add_p("۳. توضیحات متا (Meta Description):\nپاراگراف چکیده‌ای است که زیر تیتر آبی در گوگل دیده می‌شود. شمارنده زنده کاراکتر در پنل تعبیه شده تا طول آن دقیقاً در بازه طلایی ۱۲۰ تا ۱۶۰ کاراکتر تنظیم شود و بریده نشود.")
    add_p("۴. کلمات کلیدی کوتاه محصول (Focus Keywords / Tags):\nچند کلمه کوتاه با کاما که هویت و طعم و دسته‌بندی محصول را مشخص می‌کنند (مثال: کروسان مغزدار، شیرینی فرانسوی، پسته تازه).")
    add_p("۵. متن جایگزین تصویر (Image Alt Text):\nمتنی که برای موتور جستجوی تصویر گوگل (Google Images) خوانده می‌شود و عکس‌های شیرینی شما را در صدر نتایج تصویری قرار می‌دهد.")
    add_p("۶. پیش‌نمایش زنده در گوگل (Live Google SERP Snippet Preview):\nکادر شبیه‌ساز واقعی گوگل که با تایپ هر حرف، شکل نهایی ظاهر صفحه شما در نتایج موتور جستجو را به نمایش می‌گذارد.")

    add_p("ب) تنظیمات سئوی سراسری سایت (تب سئو در پنل مدیریت):", bold=True, color=RGBColor(184, 134, 11))
    add_p("• الگوی عنوان صفحات و تگ کانونیکال (Canonical URL)\n• متادیسکریپشن سراسری سایت و کلمات کلیدی اصلی برند\n• تگ‌های شبکه‌های اجتماعی و پیام‌رسان‌ها (Open Graph Title, Description, Image)\n• کد تایید گوگل سرچ کنسول (Google Search Console Verification Tag)\n• داده‌های ساختاریافته اسکیما (Schema.org Bakery / LocalBusiness JSON-LD) جهت نمایش ستاره‌ها و ساعات کاری قنادی در گوگل\n• شبیه‌ساز فایل‌های نقشه سایت (sitemap.xml) و ربات‌ها (robots.txt)")

    # -------------------------------------------------------------
    # SECTION 4: Product Catalog & Price Management
    # -------------------------------------------------------------
    add_section_header("۴. راهنمای مدیریت محصولات و قیمت‌ها", "🧁")
    add_p("در پنل مدیریت و در تب «محصولات و قیمت‌ها»، کلیه شیرینی‌ها و کیک‌های فروشگاه قابل نظارت و ویرایش هستند:")
    add_p("• تغییر سریع قیمت: در ستون قیمت هر محصول، مبلغ مورد نظر را به تومان وارد کرده و دکمه «ذخیره قیمت» را بزنید؛ قیمت بلافاصله در کل فروشگاه و سبد خرید به‌روزرسانی می‌شود.")
    add_p("• ویرایش کامل محصول: با کلیک روی ردیف هر محصول یا دکمه «ویرایش»، می‌توانید نام محصول، دسته‌بندی، تصویر (با امکان آپلود مستقیم عکس جدید یا تغییر لینک اینترنتی)، توضیحات و فیلدهای سئو را ویرایش کنید.")
    add_p("• افزودن محصول جدید: با کلیک روی دکمه «+ افزودن محصول جدید»، فرم کامل باز می‌شود که شامل بارگذاری عکس، تعیین قیمت، واحد فروش، توضیحات و مشخصات سئو می‌باشد.")
    add_p("• بازگرداندن اطلاعات قبلی: دکمه بالای صفحه کاتالوگ اولیه و استانداردهای پیش‌فرض را در صورت نیاز بازنشانی می‌کند.")

    # -------------------------------------------------------------
    # SECTION 5: Cake Customizer & Custom Orders
    # -------------------------------------------------------------
    add_section_header("۵. راهنمای سیستم کیک سفارشی و مجالس تشریفاتی", "🎂")
    add_p("الف) سفارش آنلاین کیک (صفحه cake-customizer.html):")
    add_p("مشتریان می‌توانند به صورت سه‌بعدی و مرحله‌به‌مرحله نوع اسفنج کیک (وانیلی فرانسوی، شکلاتی دابل، رد ولوت، هویج گردو)، فیلینگ‌های اختصاصی (کرم پسته، نوتلا توت‌فرنگی، کارامل نمکی)، وزن کیک، مناسبت، شعبه تحویل و متن سفارشی روی کیک را تعیین کنند. قیمت به صورت خودکار و زنده محاسبه شده و پس از ثبت، مستقیماً به تب «سفارشات کیک» در پنل مدیریت ارسال می‌شود.")

    # Insert Cake Image if available
    img_cake = r"C:\Users\PADIDAR\.gemini\antigravity-ide\scratch\artisanal-pastry\assets\images\cake_customizer_hero.jpg"
    if os.path.exists(img_cake):
        p_cimg = doc.add_paragraph()
        p_cimg.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cimg.paragraph_format.space_after = Pt(12)
        p_cimg.add_run().add_picture(img_cake, width=Inches(5.0))

    add_p("ب) سفارشات تشریفات و مجالس (صفحه custom-orders.html):")
    add_p("امکان انتخاب آیتم‌های بار شیرینی، فینگر فود، تعداد مهمان، تاریخ و ساعت مراسم و ثبت پیش‌فاکتور برای شعبات منتخب. سفارشات در تب «سفارشات مجالس» در پنل ثبت و قابل پیگیری هستند.")

    # -------------------------------------------------------------
    # SECTION 6: Branches & Story Telling
    # -------------------------------------------------------------
    add_section_header("۶. شعبات و بخش درباره ما (داستان برند)", "📍")
    add_p("بخش شعبات و درباره ما با لحنی آماده برای برند شما طراحی شده است. کارت‌های شعبات همراه با تصاویر ساختمان شعب به شما این امکان را می‌دهد که اطلاعات آدرس، تلفن و ساعات کاری قنادی خود را قرار دهید.")
    add_p("در بخش «درباره ما»، کادری تعبیه شده است تا بتوانید سرگذشت، داستان پشت برند، تعهدات کیفی، استفاده از مواد اولیه ارگانیک و دلایل تمایز خود از سایر قنادی‌ها را برای مشتریان شرح دهید.")

    # Insert Branch Image if available
    img_b1 = r"C:\Users\PADIDAR\.gemini\antigravity-ide\scratch\artisanal-pastry\assets\images\branches\branch_1.jpg"
    if os.path.exists(img_b1):
        p_bimg = doc.add_paragraph()
        p_bimg.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_bimg.paragraph_format.space_after = Pt(12)
        p_bimg.add_run().add_picture(img_b1, width=Inches(5.0))

    # -------------------------------------------------------------
    # SECTION 7: CEO Management Controls
    # -------------------------------------------------------------
    add_section_header("۷. دسترسی‌های ویژه مدیر ارشد (CEO)", "👑")
    add_p("مدیر ارشد (حساب کاربری ceo) امکانات مدیریتی بالادستی را در اختیار دارد:")
    add_p("۱. مشاهده فهرست کامل تمام ادمین‌های شاغل در سیستم همراه با تاریخ ثبت و شماره تماس")
    add_p("۲. افزودن ادمین جدید با مشخصات، نام کاربری و رمز عبور اختصاصی")
    add_p("۳. تغییر رمز عبور و ویرایش نام کاربری هر یک از ادمین‌ها")
    add_p("۴. امکان حذف دسترسی ادمین‌های سابق (بدون امکان حذف ناخواسته حساب CEO)")
    add_p("۵. تغییر و ذخیره کلیدواژه‌های ورود اختصاصی (Easter Egg Words) در هر لحظه")

    # Footer note
    add_callout(
        "این سند حاوی کلیه اطلاعات محرمانه مدیریت قنادی است. لطفاً پس از مطالعه، رمز عبور پیش‌فرض (123) را از طریق تب «پروفایل و تغییر رمز» تغییر دهید و این فایل را در مکانی امن نگهداری فرمایید.",
        "توصیه امنیتی مهم",
        "FEF2F2",
        "EF4444"
    )

    doc_path = r"C:\Users\PADIDAR\.gemini\antigravity-ide\scratch\artisanal-pastry\راهنمای_جامع_مدیریت_قنادی.docx"
    doc.save(doc_path)
    print("Word document successfully created.")

if __name__ == '__main__':
    create_manual()
