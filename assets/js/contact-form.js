function submitForm(event) {
    event.preventDefault()
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let subject = document.getElementById("subject").value
    let skill = document.getElementById("skill").value
    let message = document.getElementById("message").value

    let emailTujuan = 'khudoririzal18@gmail.com'

    let a = document.createElement("a")

    a.href = `mailto:${emailTujuan}?subject=${subject}&body=${`Halo, nama saya ${name}. Silahkan hubungi saya di ${email}. Skill saya adalah ${skill}. Berikut yang ingin saya sampaikan : ${message}`}`

    a.click()
}