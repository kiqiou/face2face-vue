<template>
          <aside class="lg:sticky lg:top-8">
        <div
          class="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#FAEE9E]/90 to-[#E5A663]/90 border border-[#E5A663]/25"
        >
          <div class="w-12 h-12 rounded-2xl bg-[#E5A663]/15 flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-[#E5A663]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 10c0 6-6 10-6 10S6 16 6 10a6 6 0 1112 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.5 10a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z"
              />
            </svg>
          </div>

          <h3 class="text-xl font-black text-slate-800 mb-3">Что будет дальше</h3>

          <ul class="flex flex-col gap-4">
            <li class="flex gap-3">
              <span
                class="flex-shrink-0 w-7 h-7 rounded-full bg-[#E5A663] text-white text-sm font-bold flex items-center justify-center"
              >
                1
              </span>
              <p class="text-sm text-black/70 leading-relaxed">
                После оформления заказа мы свяжемся с вами
                <span class="font-semibold text-black/80">звонком или сообщением в Telegram/Viber</span>
                — в зависимости от выбранного способа подтверждения.
              </p>
            </li>

            <li class="flex gap-3">
              <span
                class="flex-shrink-0 w-7 h-7 rounded-full bg-[#E5A663] text-white text-sm font-bold flex items-center justify-center"
              >
                2
              </span>
              <p class="text-sm text-black/70 leading-relaxed">
                Подтвердим наличие товаров и
                <span class="font-semibold text-black/80">согласуем удобное время самовывоза</span>.
              </p>
            </li>

            <li class="flex gap-3">
              <span
                class="flex-shrink-0 w-7 h-7 rounded-full bg-[#E5A663] text-white text-sm font-bold flex items-center justify-center"
              >
                3
              </span>
              <p class="text-sm text-black/70 leading-relaxed">
                Вы приезжаете в удобное время, оплачиваете
                <span class="font-semibold text-black/80">картой или наличными</span>
                и забираете заказ.
              </p>
            </li>
          </ul>

          <div class="mt-6 pt-5 border-t border-[#E5A663]/20 flex items-start gap-2">
            <svg class="w-5 h-5 text-[#E5A663] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-xs text-black/50 leading-relaxed">
              Если не дозвонимся или не получим ответ в течение суток — заказ может быть отменён.
            </p>
          </div>
        </div>
      </aside>
</template>