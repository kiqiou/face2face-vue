<template>
  <div class="flex flex-col items-center min-h-screen">
    <div class="rounded-3xl p-10 text-center max-w-md w-full">
      <h1
        class="text-5xl font-black bg-[#E5A663] bg-clip-text text-transparent mb-4"
      >
        Вы записаны!
      </h1>

      <p class="text-slate-600 text-2xl leading-relaxed">
        Вы успешно записались<br />
        Мы уже ждём вас 💛
      </p>

      <div class="mt-6 text-lg text-slate-500">
        Записи можно просмотреть в личном кабинете
      </div>

      <button
        class="mt-8 px-6 py-3 rounded-xl bg-[#E5A663] text-white font-semibold shadow-md hover:shadow-lg transition-all"
        @click="$router.push('/')"
      >
        На главную
      </button>
    </div>
  </div>
</template>
