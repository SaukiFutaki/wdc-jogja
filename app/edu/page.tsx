import type React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  Users,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <main className="bg-background">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary/80 to-secondary/80 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 z-10 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
                Belajar & Berkembang dengan Edukasi{" "}
                <span className="text-secondary-foreground">Berkelanjutan</span>
              </h1>
              <p className="text-primary-foreground/80 mb-8 max-w-md">
                Temukan koleksi sumber belajar, lokakarya, dan materi kami yang
                dirancang untuk mempromosikan fashion berkelanjutan dan
                kesadaran lingkungan.
              </p>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-full">
                Jelajahi Kursus
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <Image
                  src="/education-hero.png"
                  alt="Workshop Edukasi"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Kategori Edukasi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CategoryCard
              icon={<BookOpen className="h-10 w-10 text-primary" />}
              title="Kursus & Lokakarya"
              description="Pengalaman belajar interaktif yang dipimpin oleh pakar industri"
              href="/education-shop/courses"
            />
            <CategoryCard
              icon={<GraduationCap className="h-10 w-10 text-secondary" />}
              title="Materi Edukasi"
              description="Buku, panduan, dan sumber daya untuk fashion berkelanjutan"
              href="/education-shop/materials"
            />
            <CategoryCard
              icon={<Lightbulb className="h-10 w-10 text-accent" />}
              title="Paket DIY"
              description="Paket belajar praktik langsung untuk kerajinan berkelanjutan"
              href="/education-shop/diy-kits"
            />
            <CategoryCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Program Komunitas"
              description="Bergabunglah dengan individu yang sepaham dalam inisiatif komunitas"
              href="/education-shop/community"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Produk Edukasi Unggulan
            </h2>
            <Link
              href="/education-shop/all"
              className="text-primary hover:text-primary/80 flex items-center"
            >
              Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCard
              image="/sustainable-fashion-book.png"
              title="Fashion Berkelanjutan: Panduan Komprehensif"
              price={29.99}
              rating={4.8}
              reviewCount={124}
              category="Buku"
            />
            <ProductCard
              image="/sewing-kit.png"
              title="Kit Menjahit Pemula dengan Bahan Daur Ulang"
              price={49.99}
              rating={4.6}
              reviewCount={87}
              category="Paket DIY"
            />
            <ProductCard
              image="/workshop-ticket.png"
              title="Lokakarya Upcycling: Transformasi Pakaian Lama"
              price={79.99}
              rating={4.9}
              reviewCount={56}
              category="Lokakarya"
            />
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-16 bg-gradient-to-r from-secondary/80 to-primary/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
                Penawaran Paket Spesial
              </h2>
              <h3 className="text-xl font-semibold mb-6 text-secondary-foreground">
                Paket Edukasi Fashion Berkelanjutan Lengkap
              </h3>
              <ul className="space-y-3 text-primary-foreground/90 mb-8">
                <li className="flex items-start">
                  <span className="bg-accent rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="h-3 w-3 text-accent-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  Buku teks komprehensif tentang fashion berkelanjutan
                </li>
                <li className="flex items-start">
                  <span className="bg-accent rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="h-3 w-3 text-accent-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  Akses ke 3 lokakarya online
                </li>
                <li className="flex items-start">
                  <span className="bg-accent rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="h-3 w-3 text-accent-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  Paket pemula upcycling DIY dengan peralatan
                </li>
                <li className="flex items-start">
                  <span className="bg-accent rounded-full p-1 mr-2 mt-1">
                    <svg
                      className="h-3 w-3 text-accent-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  Keanggotaan 1 tahun untuk komunitas fashion berkelanjutan kami
                </li>
              </ul>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-primary-foreground/70 line-through">
                    Rp 3.749.000
                  </span>
                  <p className="text-3xl font-bold text-primary-foreground">Rp 2.699.000</p>
                </div>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-full">
                  Dapatkan Paket
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <Image
                  src="/education-bundle.png"
                  alt="Paket edukasi"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Mengapa Memilih Produk Edukasi Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              title="Konten Dipimpin Pakar"
              description="Semua materi edukasi kami dibuat oleh pakar industri dengan pengalaman bertahun-tahun di bidang fashion berkelanjutan."
            />
            <BenefitCard
              title="Keterampilan Praktis"
              description="Pelajari keterampilan praktis yang dapat segera Anda terapkan untuk membuat dan memelihara lemari pakaian yang berkelanjutan."
            />
            <BenefitCard
              title="Dukungan Komunitas"
              description="Bergabunglah dengan komunitas individu yang sepaham yang bersemangat tentang fashion berkelanjutan."
            />
            <BenefitCard
              title="Bahan Ramah Lingkungan"
              description="Semua bahan fisik terbuat dari sumber yang didaur ulang atau berkelanjutan, meminimalkan dampak lingkungan."
            />
            <BenefitCard
              title="Akses Seumur Hidup"
              description="Setelah dibeli, nikmati akses seumur hidup ke konten digital dengan pembaruan rutin."
            />
            <BenefitCard
              title="Sertifikat Penyelesaian"
              description="Terima sertifikat setelah menyelesaikan kursus untuk menunjukkan komitmen Anda terhadap keberlanjutan."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Apa Kata Siswa Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Kursus fashion berkelanjutan benar-benar mengubah cara saya memandang pakaian. Saya telah belajar banyak tentang produksi etis dan sekarang membuat pilihan yang lebih sadar."
              author="Sarah J."
              role="Mahasiswa Desain Fashion"
              rating={5}
            />
            <TestimonialCard
              quote="Paket upcycling DIY sangat cocok untuk pemula seperti saya. Instruksinya jelas, dan saya bisa mengubah jeans lama saya menjadi tas jinjing yang cantik!"
              author="Michael T."
              role="Hobi"
              rating={4}
            />
            <TestimonialCard
              quote="Sebagai guru, saya menemukan materi edukasi sangat berharga untuk memperkenalkan konsep keberlanjutan kepada siswa saya. Sumber dayanya dirancang dengan baik dan menarik."
              author="Lisa M."
              role="Guru SMA"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/80 to-secondary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
            Siap Memulai Perjalanan Edukasi Berkelanjutan Anda?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan siswa yang telah mengubah pendekatan
            mereka terhadap fashion melalui sumber daya edukasi kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-full">
              Jelajahi Semua Sumber Daya
            </Button>
            <Button
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3 rounded-full"
            >
              Bergabung dengan Komunitas Kami
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function CategoryCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="bg-card border-border p-6 h-full hover:border-primary transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{icon}</div>
          <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </Card>
    </Link>
  );
}

function ProductCard({
  image,
  title,
  price,
  rating,
  reviewCount,
  category,
}: {
  image: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
}) {
  return (
    <Card className="bg-card border-border overflow-hidden hover:border-primary transition-colors">
      <div className="relative aspect-video">
        <Image
          src={
            image.startsWith("/")
              ? image
              : "/placeholder.svg?height=200&width=300"
          }
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-accent text-accent"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-card-foreground">
            Rp {(price * 15000).toLocaleString()}
          </span>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Tambah ke Keranjang
          </Button>
        </div>
      </div>
    </Card>
  );
}

function BenefitCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-xl font-semibold mb-3 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  rating,
}: {
  quote: string;
  author: string;
  role: string;
  rating: number;
}) {
  return (
    <Card className="bg-card border-border p-6">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating
                ? "fill-accent text-accent"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-card-foreground mb-4 italic">&rdquo;{quote}&rdquo;</p>
      <Separator className="bg-border mb-4" />
      <div>
        <p className="font-semibold text-card-foreground">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </Card>
  );
}