<template>
  <aside class="lg:sticky lg:top-8">
    <div class="rounded-4xl border border-line bg-peach/60 p-6 md:p-8">
      <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
        <svg class="h-6 w-6 text-caramel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 10c0 6-6 10-6 10S6 16 6 10a6 6 0 1112 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.5 10a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z" />
        </svg>
      </div>

      <h3 class="mb-4 font-display text-xl font-medium text-ink">Что будет дальше</h3>

      <ul class="flex flex-col gap-4">
        <li class="flex gap-3">
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-caramel text-sm font-medium text-white">1</span>
          <p class="text-sm leading-relaxed text-ink-muted">
            После оформления заказа мы свяжемся с вами
            <span class="font-semibold text-ink">звонком или сообщением в Telegram/Viber</span>
            — в зависимости от выбранного способа подтверждения.
          </p>
        </li>

        <li class="flex gap-3">
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-caramel text-sm font-medium text-white">2</span>
          <p class="text-sm leading-relaxed text-ink-muted">
            Подтвердим наличие товаров и
            <span class="font-semibold text-ink">согласуем удобное время самовывоза</span>.
          </p>
        </li>

        <li class="flex gap-3">
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-caramel text-sm font-medium text-white">3</span>
          <p class="text-sm leading-relaxed text-ink-muted">
            Вы приезжаете в удобное время, оплачиваете
            <span class="font-semibold text-ink">картой или наличными</span>
            и забираете заказ.
          </p>
        </li>
      </ul>

      <div class="mt-6 flex items-start gap-2 border-t border-line pt-5">
        <svg class="mt-0.5 h-5 w-5 shrink-0 text-caramel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xs leading-relaxed text-ink-muted">
          Если не дозвонимся или не получим ответ в течение суток — заказ может быть отменён.
        </p>
      </div>
    </div>
  </aside>
</template>