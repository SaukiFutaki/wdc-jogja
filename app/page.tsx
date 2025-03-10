import BarterSection from "@/components/barter/barter-section";
import Footer from "@/components/footer";
import HeroCarousel from "@/components/hero";
import ProductSection from "@/components/products/product-section";
import { MarqueeDemo } from "@/components/testimonial";
import { Separator } from "@/components/ui/separator";
import { getUserNotifications } from "@/lib/actions/notification";
import { getAllProducts, getAllProductsBarter } from "@/lib/actions/product";
export default async function Home() {
  const allDataProduct = await getAllProducts();
  const notif = await getUserNotifications();
  console.log("notif", notif);
  const mappedData =
    allDataProduct.data?.map((item) => ({
      ...item,
      description: item.description || "",
      price: item.price || 0,
      category: item.category || "",
      quantity: item.quantity || 0,
      discount: item.discount || 0,
      status: item.status || "available",
      primaryImageUrl: item.primaryImageUrl || "",
      sustainabilityRating:
        item.sustainabilityRating === null
          ? undefined
          : item.sustainabilityRating,
    })) || [];

  const dataBarter = await getAllProductsBarter();
  const mappedDataBarter =
    dataBarter.data?.map((item) => ({
      ...item,
      description: item.description || "",
      price: item.price || 0,
      category: item.category || "",
      quantity: item.quantity || 0,
      discount: item.discount || 0,
      status: item.status || "available",
      primaryImageUrl: item.primaryImageUrl || "",
      sustainabilityRating:
        item.sustainabilityRating === null
          ? undefined
          : item.sustainabilityRating,
    })) || [];
  return (
    <div>
      <div className="">
        {/* <NotificationExample notifications={notif.notifications as unknown as Notification[]} /> */}
        <HeroCarousel />
      </div>
      <ProductSection data={mappedData} />
      <div className="container mx-auto px-4 py-16">
        <Separator />
      </div>
      <BarterSection data={mappedDataBarter} />
      <div className="container mx-auto px-4 py-16">
        <MarqueeDemo />
      </div>
      <Footer />
    </div>
  );
}
