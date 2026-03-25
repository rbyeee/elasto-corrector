$(document).ready(function () {
	$(".smile__item-height").matchHeight({
		byRow: true,
	})

	$(".tehnology__item-height").matchHeight({
		byRow: true,
	})

	$(".perfect__descript-height").matchHeight({})

	$(".will-do__description-height").matchHeight({
		byRow: true,
	})
	$(".quest__content").hide()

	$(".quest__label").on("click", function (e) {
		e.preventDefault()
		const $item = $(this).closest(".quest__item")
		const $content = $item.find(".quest__content")

		if ($item.hasClass("active")) {
			$item.removeClass("active")
			$content.slideUp(300)
		} else {
			$(".quest__item").removeClass("active")
			$(".quest__content").slideUp(300)

			$item.addClass("active")
			$content.slideDown(300)
		}
	})

	const $items = $(".tehnology__item")
	const $circles = $(".tehnology-circle")

	$items.each(function (index) {
		$(this)
			.on("mouseenter", function () {
				$circles.removeClass("active")
				$circles.eq(index).addClass("active")
			})
			.on("mouseleave", function () {
				$circles.removeClass("active")
			})
	})

	let currentSlider = null

	function destroySlider(sliderInstance) {
		if (sliderInstance && typeof sliderInstance.destroy === "function") {
			sliderInstance.destroy()
		}
	}

	function createSlider(element) {
		return new SlickImageCompare(element, {
			snapToStart: true,
			beforeLabel: "До",
			afterLabel: "После",
		})
	}

	const $activeSlider = $(".before-after.active")
	if ($activeSlider.length) {
		currentSlider = createSlider($activeSlider[0])
	}

	$(".compare-widget__link").on("click", function () {
		const index = $(this).index()
		const $targetSlider = $(".before-after").eq(index)

		if ($targetSlider.hasClass("active")) return

		$(".compare-widget__link").removeClass("active")
		$(this).addClass("active")

		$(".before-after").removeClass("active")
		$targetSlider.addClass("active")

		destroySlider(currentSlider)

		currentSlider = createSlider($targetSlider[0])
	})
	const $tabs = $(".about-tabs__link")
	const $swipers = $(".about-swiper")
	const $swNumber = $(".about-sw-number")
	const $arrowLeft = $(".about-arrow-left")
	const $arrowRight = $(".about-arrow-right")

	let currentSwiper = null

	function updateGroupCounter(swiperInstance) {
		const totalGroups = swiperInstance.snapGrid.length
		const currentGroup = swiperInstance.snapIndex + 1

		const spans = $swNumber.find("span:not(.sw-line)")
		if (spans.length >= 2) {
			spans.eq(0).text(currentGroup)
			spans.eq(1).text(totalGroups)
		}
	}

	function destroyCurrentSwiper() {
		if (currentSwiper) {
			if (typeof currentSwiper.destroy === "function") {
				currentSwiper.destroy(true, true)
			}
			currentSwiper = null
		}
	}

	function initSwiper(container) {
		return new Swiper(container, {
			slidesPerView: 3,
			spaceBetween: 8,
			slidesPerGroup: 3,
			navigation: {
				nextEl: $arrowRight[0],
				prevEl: $arrowLeft[0],
			},
			on: {
				init: function (swiper) {
					updateGroupCounter(swiper)
				},
				slideChange: function (swiper) {
					updateGroupCounter(swiper)
				},
				resize: function (swiper) {
					updateGroupCounter(swiper)
				},
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
					slidesPerGroup: 1,
				},
				640: {
					slidesPerView: 1,
					slidesPerGroup: 1,
				},
				768: {
					slidesPerView: 2,
					slidesPerGroup: 2,
				},
				1024: {
					slidesPerView: 3,
					slidesPerGroup: 3,
				},
			},
		})
	}

	function switchTab(index) {
		$tabs.removeClass("active")
		$tabs.eq(index).addClass("active")

		$swipers.removeClass("active")
		$swipers.eq(index).addClass("active")

		destroyCurrentSwiper()

		const $activeContainer = $swipers.eq(index)
		currentSwiper = initSwiper($activeContainer[0])
	}

	let activeIndex = 0
	$swipers.each(function (i) {
		if ($(this).hasClass("active")) activeIndex = i
	})
	$tabs.removeClass("active")
	$tabs.eq(activeIndex).addClass("active")
	$swipers.each(function (i) {
		if (i !== activeIndex) $(this).removeClass("active")
		else $(this).addClass("active")
	})
	currentSwiper = initSwiper($swipers.eq(activeIndex)[0])

	$tabs.on("click", function (e) {
		e.preventDefault()
		const index = $(this).index()
		if ($(this).hasClass("active")) return
		switchTab(index)
	})

	const sertificatSwiper = new Swiper(".sertificat-swiper", {
		slidesPerView: 6,
		spaceBetween: 20,
		slidesPerGroup: 1,
		navigation: {
			nextEl: ".sertificat-sw-arrow-r",
			prevEl: ".sertificat-sw-arrow-l",
		},
		breakpoints: {
			320: {
				slidesPerView: 2,
			},
			640: {
				slidesPerView: 3,
			},
			768: {
				slidesPerView: 4,
			},
			1024: {
				slidesPerView: 6,
			},
		},
	})
	var $list = $(".map-widget__list")
	var $emptyMsg = $list.find(".map-widget__empty")

	if (!$emptyMsg.length) {
		$emptyMsg = $('<div class="map-widget__empty">Ничего не найдено</div>')
		$list.append($emptyMsg)
		$emptyMsg.hide()
	}

	function filterList() {
		var searchText = $(".map-widget__search .input_default")
			.val()
			.toLowerCase()
			.trim()
		var hasVisible = false

		$(".map-widget__item").each(function () {
			var label = $(this).find(".map-widget__label").text().toLowerCase()
			if (searchText === "" || label.indexOf(searchText) !== -1) {
				$(this).show()
				hasVisible = true
			} else {
				$(this).hide()
			}
		})

		if (hasVisible) {
			$emptyMsg.hide()
		} else {
			$emptyMsg.show()
		}
	}

	$(".map-widget__search .input_default").on("input", filterList)

	var map = null
	var placemarks = []

	// --- 1. Инициализация карты после загрузки API ---
	ymaps.ready(function () {
		var defaultCenter = [55.751574, 37.573856]
		map = new ymaps.Map("map", {
			center: defaultCenter,
			zoom: 10,
			controls: ["zoomControl", "fullscreenControl"],
		})

		// --- 2. Создаём метки для всех элементов списка ---
		$(".map-widget__item").each(function (index) {
			var $item = $(this)
			var coordsData = $item.data("coords")
			var label = $item.find(".map-widget__label").text()

			if (!Array.isArray(coordsData)) {
				var raw = $item.attr("data-coords")
				if (raw) {
					try {
						var cleaned = raw.trim()
						coordsData = JSON.parse(cleaned)
					} catch (e) {
						console.warn("Не удалось распарсить координаты:", raw, e)
						return
					}
				}
			}

			if (Array.isArray(coordsData) && coordsData.length >= 2) {
				var lat = parseFloat(coordsData[0])
				var lng = parseFloat(coordsData[1])
				if (!isNaN(lat) && !isNaN(lng)) {
					var placemark = new ymaps.Placemark(
						[lat, lng],
						{
							balloonContent: label,
						},
						{
							preset: "islands#blueIcon",
						},
					)
					placemarks.push(placemark)
					map.geoObjects.add(placemark)

					$item.data("placemark-index", placemarks.length - 1)
				}
			}
		})

		// --- 3. Обработка клика по пункту списка: центрируем карту на его метке ---
		function handleItemClick(e) {
			e.preventDefault()
			var $this = $(this)

			$(".map-widget__item").removeClass("active")
			$this.addClass("active")

			var idx = $this.data("placemark-index")
			if (idx !== undefined && placemarks[idx]) {
				var coords = placemarks[idx].geometry.getCoordinates()
				map.setCenter(coords, 15)
				placemarks[idx].balloon.open()
			} else {
				var coordsData = $this.data("coords")
				if (Array.isArray(coordsData) && coordsData.length >= 2) {
					var lat = parseFloat(coordsData[0])
					var lng = parseFloat(coordsData[1])
					if (!isNaN(lat) && !isNaN(lng)) {
						map.setCenter([lat, lng], 15)
					}
				}
			}
		}

		$(".map-widget__item").on("click", handleItemClick)
	})

	// index-swiper

	$(function () {
		const swiper = new Swiper(".index-swiper", {
			slidesPerView: 1,
			loop: true,
			effect: "fade",
			fadeEffect: {
				crossFade: true,
			},
			navigation: {
				nextEl: ".simple-slider__next",
				prevEl: ".simple-slider__prev",
			},
			on: {
				init: function () {
					updatePagination(this)
					updatePrevLabel(this)
				},
				slideChange: function () {
					updatePagination(this)
					updatePrevLabel(this)
				},
			},
		})
		function updatePagination(swiperInstance) {
			const current = swiperInstance.realIndex + 1
			const total = swiperInstance.slides.length
			$(".simple-slider__current").text(current)
			$(".simple-slider__total").text(total)
		}

		function updatePrevLabel(swiperInstance) {
			let prevIndex = swiperInstance.previousIndex
			if (prevIndex === undefined || prevIndex === null) {
				prevIndex = swiperInstance.slides.length - 1
			}

			const prevSlide = swiperInstance.slides[prevIndex]
			if (prevSlide) {
				const prevLabel = $(prevSlide).find(".index-swiper__label").text()
				$(".index-container-sl-label").text(prevLabel)
			}
		}
	})
})
