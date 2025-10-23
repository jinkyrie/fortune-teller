import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KVKKPage() {
  return (
    <div className="min-h-screen celestial-gradient">
      <nav className="flex items-center p-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pb-12">
        <div className="glass-card">
          <h1 className="font-cormorant text-4xl font-bold text-[var(--foreground)] mb-6 text-center">
            KVKK (GDPR) Aydınlatma Metni
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-[var(--muted)] mb-6">
              Son güncelleme: {new Date().toLocaleDateString()}
            </p>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Veri Sorumlusu
            </h2>
            <p className="text-[var(--muted)] mb-6">
              KahveYolu olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) 
              kapsamında kişisel verilerinizi işlemekteyiz. Bu aydınlatma metni, kişisel verilerinizin 
              nasıl işlendiği hakkında bilgi vermek amacıyla hazırlanmıştır.
            </p>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              İşlenen Kişisel Veriler
            </h2>
            <p className="text-[var(--muted)] mb-4">
              KahveYolu hizmetlerini sunabilmek için aşağıdaki kişisel verilerinizi işlemekteyiz:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, yaş, cinsiyet, medeni durum</li>
              <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası</li>
              <li><strong>Hesap Bilgileri:</strong> Kullanıcı adı, şifre (şifrelenmiş), hesap oluşturma tarihi</li>
              <li><strong>Sipariş Bilgileri:</strong> Sipariş detayları, durum, tamamlanma tarihi, fal sonuçları</li>
              <li><strong>Görsel Veriler:</strong> Yüklediğiniz kahve fincanı fotoğrafları (Cloudinary'de güvenli şekilde saklanır)</li>
              <li><strong>Ödeme Bilgileri:</strong> Iyzico ve PayTR aracılığıyla işlenir (bizde saklanmaz)</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Veri İşleme Amaçları
            </h2>
            <p className="text-[var(--muted)] mb-4">
              Kişisel verilerinizi aşağıdaki amaçlarla işlemekteyiz:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li><strong>Hizmet Sunumu:</strong> Kahve fincanı fal hizmetlerini sunmak</li>
              <li><strong>Hesap Yönetimi:</strong> Kullanıcı hesabını oluşturmak ve yönetmek</li>
              <li><strong>Ödeme İşleme:</strong> Iyzico ve PayTR aracılığıyla ödemeleri işlemek</li>
              <li><strong>İletişim:</strong> Sipariş onayları, güncellemeler ve müşteri desteği göndermek</li>
              <li><strong>Görsel Analiz:</strong> Yüklenen kahve fincanı fotoğraflarını analiz etmek</li>
              <li><strong>Hizmet Geliştirme:</strong> Hizmetlerimizi geliştirmek ve yeni özellikler geliştirmek</li>
              <li><strong>Yasal Uyumluluk:</strong> Geçerli yasalar ve düzenlemelere uymak</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Veri Güvenliği
            </h2>
            <p className="text-[var(--muted)] mb-4">
              Kişisel verilerinizi korumak için aşağıdaki güvenlik önlemlerini almaktayız:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li><strong>Şifreleme:</strong> Şifreler bcrypt ile şifrelenir</li>
              <li><strong>Güvenli Depolama:</strong> Görseller Cloudinary'de güvenli erişim kontrolleri ile saklanır</li>
              <li><strong>Ödeme Güvenliği:</strong> Ödeme işleme sertifikalı sağlayıcılar tarafından yapılır</li>
              <li><strong>Veri Saklama:</strong> Görseller 2 hafta sonra otomatik silinir</li>
              <li><strong>Erişim Kontrolleri:</strong> Kişisel verilere sadece gerekli durumlarda erişim sağlanır</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Haklarınız
            </h2>
            <p className="text-[var(--muted)] mb-4">
              KVKK kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li><strong>Bilgi Alma:</strong> Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li><strong>Bilgi Talep Etme:</strong> İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
              <li><strong>Düzeltme:</strong> Eksik veya yanlış işlenen verilerin düzeltilmesini isteme</li>
              <li><strong>Silme:</strong> Belirli şartlar altında verilerin silinmesini isteme</li>
              <li><strong>İtiraz:</strong> Veri işleme faaliyetlerine itiraz etme</li>
              <li><strong>Zararın Giderilmesi:</strong> Kişisel verilerin kanuna aykırı işlenmesi nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              İletişim
            </h2>
            <p className="text-[var(--muted)] mb-6">
              KVKK kapsamındaki haklarınızı kullanmak için bizimle iletişime geçebilirsiniz:
              <br />
              E-posta: support@kahveyolu.com
              <br />
              Website: https://kahveyolu.com
            </p>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              Haklarınız
            </h2>
            <p className="text-[var(--muted)] mb-4">
              KVKK kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc list-inside text-[var(--muted)] mb-6">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
              <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
            </ul>

            <h2 className="font-cormorant text-2xl font-semibold text-[var(--foreground)] mb-4">
              İletişim
            </h2>
            <p className="text-[var(--muted)] mb-6">
              KVKK kapsamındaki haklarınızı kullanmak için bizimle iletişime geçebilirsiniz:
              <br />
              E-posta: support@kahveyolu.com
              <br />
              Website: https://kahveyolu.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

