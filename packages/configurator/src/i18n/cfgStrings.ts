import type { Language } from '@care/shared-types'

const S: Record<string, Record<Language, string>> = {
  // ── Row menu category tabs ──
  'cat.layout': { vi: 'Bố cục', en: 'Layout' },
  'cat.style': { vi: 'Kiểu dáng', en: 'Style' },
  'cat.items': { vi: 'Mục', en: 'Items' },
  'cat.order': { vi: 'Thứ tự', en: 'Order' },
  'cat.toggle': { vi: 'Hiển thị', en: 'Visible' },

  // ── Style sub-labels ──
  'style.corners': { vi: 'Bo góc', en: 'Corners' },
  'style.buttons': { vi: 'Nút', en: 'Buttons' },
  'style.cards': { vi: 'Thẻ', en: 'Cards' },
  'style.gradient': { vi: 'Chuyển màu', en: 'Gradient' },

  // ── Order buttons ──
  'order.up': { vi: 'Lên', en: 'Up' },
  'order.down': { vi: 'Xuống', en: 'Down' },

  // ── Section names ──
  'sec.hero': { vi: 'Trang chủ', en: 'Hero' },
  'sec.about': { vi: 'Giới thiệu', en: 'About' },
  'sec.manifesto': { vi: 'Tuyên ngôn', en: 'Manifesto' },
  'sec.schedule': { vi: 'Lịch học', en: 'Schedule' },
  'sec.process': { vi: 'Hành trình', en: 'Your Journey' },
  'sec.instructors': { vi: 'Huấn luyện viên', en: 'Instructors' },
  'sec.pricing': { vi: 'Bảng giá', en: 'Pricing' },
  'sec.studioTour': { vi: 'Tham quan', en: 'Studio Tour' },
  'sec.testimonials': { vi: 'Cảm nhận', en: 'Testimonials' },
  'sec.events': { vi: 'Sự kiện', en: 'Events' },
  'sec.blog': { vi: 'Bài viết', en: 'Blog' },
  'sec.partners': { vi: 'Đối tác', en: 'Partners' },
  'sec.socialMedia': { vi: 'Mạng xã hội', en: 'Social Media' },
  'sec.faq': { vi: 'Câu hỏi', en: 'FAQ' },
  'sec.contact': { vi: 'Liên hệ', en: 'Contact' },

  // ── Layout options ──
  'lo.center': { vi: 'Giữa', en: 'Center' },
  'lo.left': { vi: 'Trái', en: 'Left' },
  'lo.split': { vi: 'Chia đôi', en: 'Split' },
  'lo.photo-left': { vi: 'Ảnh trái', en: 'Photo Left' },
  'lo.photo-right': { vi: 'Ảnh phải', en: 'Photo Right' },
  'lo.stacked': { vi: 'Chồng lên', en: 'Stacked' },
  'lo.grid': { vi: 'Lưới', en: 'Grid' },
  'lo.list': { vi: 'Danh sách', en: 'List' },
  'lo.cards': { vi: 'Thẻ', en: 'Cards' },
  'lo.duo': { vi: 'Đôi', en: 'Duo' },
  'lo.scroll': { vi: 'Cuộn', en: 'Scroll' },
  'lo.table': { vi: 'Bảng', en: 'Table' },

  // ── Button / Card / Gradient style chips ──
  'chip.rounded': { vi: 'Bo tròn', en: 'Rounded' },
  'chip.sharp': { vi: 'Sắc nét', en: 'Sharp' },
  'chip.pill': { vi: 'Viên', en: 'Pill' },
  'chip.flat': { vi: 'Phẳng', en: 'Flat' },
  'chip.shadow': { vi: 'Bóng', en: 'Shadow' },
  'chip.outline': { vi: 'Viền', en: 'Outline' },
  'chip.none': { vi: 'Không', en: 'None' },
  'chip.linear': { vi: 'Tuyến tính', en: 'Linear' },
  'chip.radial': { vi: 'Toả', en: 'Radial' },
  'chip.diagonal': { vi: 'Chéo', en: 'Diagonal' },
  'chip.mesh': { vi: 'Lưới', en: 'Mesh' },
  'chip.subtle': { vi: 'Nhẹ', en: 'Subtle' },

  // ── ThemePanel labels ──
  'theme.colors': { vi: 'Màu sắc', en: 'Colors' },
  'theme.colorsDesc': { vi: 'Nền, thẻ, phần & nhấn', en: 'Background, card, section & accent' },
  'theme.logo': { vi: 'Logo', en: 'Logo' },
  'theme.logoSize': { vi: 'Kích thước logo', en: 'Logo Size' },
  'theme.uploadLogo': { vi: 'Tải logo lên', en: 'Upload Logo' },
  'theme.removeLogo': { vi: 'Xoá logo', en: 'Remove Logo' },
  'theme.resetColors': { vi: 'Đặt lại màu', en: 'Reset Colors' },
  'color.background': { vi: 'Nền', en: 'Background' },
  'color.card': { vi: 'Thẻ', en: 'Card' },
  'color.section': { vi: 'Phần', en: 'Section' },
  'color.accent': { vi: 'Nhấn', en: 'Accent' },
  'theme.custom': { vi: 'Tuỳ chỉnh', en: 'Custom' },
  'theme.small': { vi: 'Nhỏ', en: 'Small' },
  'theme.large': { vi: 'Lớn', en: 'Large' },
  'theme.catLight': { vi: 'Sáng', en: 'Light' },
  'theme.catDark': { vi: 'Tối', en: 'Dark' },
  'theme.catWarm': { vi: 'Ấm', en: 'Warm' },
  'theme.catCool': { vi: 'Mát', en: 'Cool' },

  // ── Dock tooltips ──
  'dock.theme': { vi: 'Giao diện', en: 'Theme' },
  'dock.typography': { vi: 'Kiểu chữ', en: 'Typography' },
  'dock.vibe': { vi: 'Phong cách', en: 'Vibe' },
  'dock.settings': { vi: 'Cài đặt', en: 'Settings' },

  // ── Tutorial ──
  'tut.skip': { vi: 'Bỏ qua', en: 'Skip' },
  'tut.next': { vi: 'Tiếp', en: 'Next' },
  'tut.done': { vi: 'Xong', en: 'Done' },
  'tut.step1.title': { vi: 'Nút cấu hình', en: 'Configurator' },
  'tut.step1.desc': { vi: 'Nhấn vào đây để mở công cụ tùy chỉnh trang web của bạn.', en: 'Click here to open the configurator for your website.' },
  'tut.step2.title': { vi: 'Thanh công cụ', en: 'Toolbar' },
  'tut.step2.desc': { vi: 'Chọn giao diện, kiểu chữ, phong cách hoặc cài đặt.', en: 'Choose theme, typography, vibe, or settings.' },
  'tut.step3.title': { vi: 'Nút phần', en: 'Section Button' },
  'tut.step3.desc': { vi: 'Mỗi phần có nút riêng. Nhấn để tùy chỉnh bố cục, kiểu và nội dung.', en: 'Each section has its own button. Click to customize layout, style, and content.' },
  'tut.step4.title': { vi: 'Menu ngang', en: 'Row Menu' },
  'tut.step4.desc': { vi: 'Điều chỉnh trực tiếp trong thanh ngang. Bạn luôn thấy kết quả bên dưới.', en: 'Adjust directly in the horizontal bar. You always see the results below.' },
}

export function ct(lang: Language, key: string): string {
  return S[key]?.[lang] ?? S[key]?.en ?? key
}
