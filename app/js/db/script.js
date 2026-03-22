$(document).ready(function () {
	$(".smile__item-height").matchHeight({
		byRow: true,
	})

	$(".tehnology__item-height").matchHeight({
		byRow: true,
	})

	$(".perfect__descript-height").matchHeight({
		byRow: true,
	})

	$(".will-do__description-height").matchHeight({
		byRow: true,
	})
	// Скрыть все контенты аккордеона при загрузке
	$(".quest__content").hide()

	// Обработчик клика по заголовку
	$(".quest__label").on("click", function (e) {
		e.preventDefault() // отменяем переход по ссылке

		const $item = $(this).closest(".quest__item") // текущий элемент аккордеона
		const $content = $item.find(".quest__content") // его контент

		// Если текущий элемент уже открыт – закрываем его
		if ($item.hasClass("active")) {
			$item.removeClass("active")
			$content.slideUp(300) // плавное закрытие
		} else {
			// Закрываем все остальные элементы
			$(".quest__item").removeClass("active")
			$(".quest__content").slideUp(300)

			// Открываем текущий
			$item.addClass("active")
			$content.slideDown(300)
		}
	})
})
