"use client";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const podiumData = [
  {
    position: "🥇 1º Lugar",
    turma: "Admísticos",
    image: "/podium/first-place.jpeg",
  },
  {
    position: "🥈 2º Lugar",
    turma: "Inforjáveis",
    image: "/podium/second-place.jpeg",
  },
  {
    position: "🥉 3º Lugar",
    turma: "Infominds",
    image: "/podium/third-place.jpeg",
  },
];

export default function PodiumCarousel() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Pódio da Edição 2025
          </h2>

          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Conheça as turmas que conquistaram os três primeiros lugares na
            edição anterior do projeto Com Amor, IF.
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[EffectCoverflow, Pagination, Autoplay]}
            effect="coverflow"
            centeredSlides
            slidesPerView="auto"
            loop={false}
            initialSlide={0}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 2,
              scale: 0.9,
            }}
          >
            {podiumData.map((item) => (
              <SwiperSlide
                key={item.position}
                className="
                    !w-[85%]
                    sm:!w-[75%]
                    md:!w-[60%]
                    lg:!w-[50%]
                "
              >
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                  <div className="relative h-[280px] sm:h-[350px] md:h-[420px]">
                    <Image
                      src={item.image}
                      alt={item.position}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl md:text-3xl font-bold">
                        {item.position}
                      </h3>

                      <p className="mt-2 text-sm md:text-lg">{item.turma}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="pointer-events-none absolute top-0 left-0 h-full w-10 md:w-12 bg-gradient-to-r from-white to-transparent z-10" />

          <div className="pointer-events-none absolute top-0 right-0 h-full w-10 md:w-12 bg-gradient-to-l from-white to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
