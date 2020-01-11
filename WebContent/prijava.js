Vue.component('prijava-registracija',{
    data: function() {
        return {

        }
    },
    template : `
    <div class="content-wrap">
    <div class="row">
    <div class="col-4">					
        <h4 class="title"><span class="text"><strong>Prijava</strong></span></h4>
        <prijava></prijava>
    </div>
    <div class="col-6 ml-auto">					
        <h4 class="title"><span class="text"><strong>Registracija</strong></span></h4>
        <registracija></registracija>			
    </div>				
</div>			
</div>
</div>`
});

Vue.component('registracija',{
    data: function() {
        return{
            korisnickoIme : undefined,
            ime : undefined,
            prezime : undefined,
            lozinka : undefined, 
            telefon : undefined,
            grad : undefined,
            email : undefined
        }
    },
    template : `
    <form action="#" method="post" v-on:submit.prevent="registrujSubmit" accept-charset="UTF-8">
        <div class="form-group">
            <label class="labels" for="inputIme">Ime</label>
            <input type="text" class="form-control" id="inputIme" placeholder="Unesite svoje ime" v-model="ime" >
            <div class="invalidacija-feed"> {{imeValidacija}} </div>
        </div>
        <div class="form-group">
            <label class="labels" for="inputPrezime">Prezime</label>
            <input type="text" class="form-control" id="inputPrezime" placeholder="Unesite svoje Prezime" v-model="prezime">
            <div class="invalidacija-feed"> {{prezimeValidacija}} </div>
        </div>
        <div class="form-group">
            <label class="labels" for="inputKorisnickoImerReg">Korisnicko ime</label>
            <input type="text" class="form-control" id="inputKorisnickoImerReg" placeholder="Unesite svoje korisnicko ime" v-model="korisnickoIme">
            <div class="invalidacija-feed"> {{korisnickoImeValidacija}} </div>
        </div>
        <div class="form-group">
            <label class="labels" for="inputEmail">Email</label>
            <input type="email" class="form-control" id="inputEmail" placeholder="Unesite svoj email" v-model="email">
            <div class="invalidacija-feed"> {{emailValidacija}} </div>
        </div>
        <div class="form-group">
            <label class="labels" for="inputLozinkaReg">Lozinka</label>
            <input type="password" class="form-control" id="inputLozinkaReg" placeholder="Unesite svoju lozinku" v-model="lozinka">
            <div class="invalidacija-feed"> {{lozinkaValidacija}} </div>
        </div>
        <div class="form-group">
            <label class="labels" for="inputGrad">Grad</label>
            <input type="text" class="form-control" id="inputGrad" placeholder="Unesite svoj grad" v-model="grad">
            <div class="invalidacija-feed"> {{gradValidacija}} </div>
        </div>
        <div class="form-group">
            <label class="labels" for="inputTelefon">Telefon</label>
            <input type="number" class="form-control" id="inputTelefon" placeholder="Unesite svoj kontakt telefon" v-model="telefon">
            <div class="invalidacija-feed"> {{telefonValidacija}} </div>
        </div>
        <button type="submit" class="btn btn-light">Registruj se</button>
    </form>	
    `,
    computed: {
        imeValidacija : function() {
            if(this.ime != undefined && this.ime.length > 0){
                let imeMatch = this.ime.match('[A-Za-z ]*');
                if(imeMatch != this.ime) {
                    return 'Ime se mora sastojati samo od slova';
                } else if(this.ime[0].match('[A-Z]') === null) {
                    return 'Ime mora pocinjati velikim slovom';
                } 
            }
            else if(this.ime === '') {
                return 'Ime je obavezno polje.';
            } else {
                return null;
            }
        },
        prezimeValidacija : function() {
            if(this.prezime != undefined && this.prezime.length > 0){
                let prezimeMatch = this.prezime.match('[A-Za-z ]*');
                if(prezimeMatch != this.prezime) {
                    return 'Prezime se mora sastojati samo od slova';
                } else if(this.prezime[0].match('[A-Z]') === null) {
                    return 'Prezime mora pocinjati velikim slovom';
                } 
            }
            else if(this.prezime === '') {
                return 'Prezime je obavezno polje.';
            } else {
                return null;
            }
        },
        korisnickoImeValidacija : function() {
            if(this.korisnickoIme === '') {
                return 'Korisnicko ime je obavezno polje';
            } else {
                return null;
            }
        },
        emailValidacija : function() {
            if(this.email === '') {
                return 'Email je obavezno polje';
            } else { 
                return null;
            }
        },
        lozinkaValidacija : function() {
            if(this.lozinka === '') { 
                return 'Lozinka je obavezno polje';
            } else { 
                return null;
            }
        },
        gradValidacija : function() {
            if(this.grad != undefined && this.grad.length > 0) {
                let gradMatch = this.grad.match('[A-Za-z ]*');
                if(gradMatch != this.grad) { 
                    return 'Grad se mora sastojati samo od slova';
                } else if(this.grad[0].match('[A-Z]') === null) { 
                    return 'Grad mora pocinjati velikim slovom';
                }
            } else if(this.grad === '') {
                return 'Grad je obavezno polje';
            } else {    
                return null;
            }
        },
        telefonValidacija : function() {
            if(this.telefon === null) {
                return 'Telefon je obavezno polje';
            } else { 
                return null;
            }
        }

    },
    methods: {
        registrujSubmit: function() {

            var date = new Date();
            var mesec = ('0' + (date.getMonth() + 1)).slice(-2);
            var dan = ('0' + date.getDate()).slice(-2);
            var godina = date.getFullYear();
            var datum = godina + '-' + mesec + '-' + dan;
            var korisnik = {
                "korisnickoIme" : this.korisnickoIme,
                "lozinka" : this.lozinka,
                "ime" : this.ime,
                "prezime" : this.prezime,
                "uloga" : "Kupac",
                "telefon" : this.telefon,
                "grad" : this.grad,
                "email" : this.email,
                "datum" :  datum
            }
            var ok = true;
            
            let imeMatch = '';
            let prezimeMatch = '';
            let gradMatch = '';
            
            if(this.ime != undefined) {
                this.ime.trim();
                imeMatch = this.ime.match('[A-Za-z]*');
            } else {
                this.ime = '';
            }

            if(this.prezime != undefined) {
                this.prezime.trim();
                prezimeMatch = this.prezime.match('[A-Za-z]*');
            } else {
                this.prezime = '';
            }

            if(this.korisnickoIme != undefined) { 
                this.korisnickoIme.trim();
            } else {
                this.korisnickoIme = '';
            }

            if(this.lozinka != undefined) {
                this.lozinka.trim();
            } else {
                this.lozinka = '';
            }

            if(this.email != undefined) {
                this.email.trim();
            } else {
                this.email = '';
            }

            if(this.grad != undefined) {
                this.grad.trim();
                gradMatch = this.grad.match('[A-Za-z ]*');
            } else {
                this.grad = '';
            }

            if(this.telefon === undefined) {
                this.telefon = null;
            }

            if(this.ime === undefined || this.ime === '' || this.korisnickoIme === undefined || this.korisnickoIme === '' ||
                this.prezime === undefined || this.prezime === '' || this.lozinka === undefined || this.lozinka === '' ||
                this.grad === undefined || this.grad === '' || this.email === undefined || this.email === '' || this.telefon === undefined
                || this.telefon === null){
					ok = false;
			} else if((prezimeMatch != this.prezime) || (imeMatch != this.ime) || (this.prezime[0].match('[A-Z]') === null) ||
					(this.ime[0].match('[A-Z]') === null) || (gradMatch != this.grad) || (this.grad[0].match('[A-Z]') === null)){
					ok = false;
			} else{
					ok = true;
            }
            
            if(ok) {
                var ap = this;
                axios.post('rest/korisnici/registracija', korisnik)
                    .then(function(response) {
                        window.location.href = '#/prijava';
                        alert("Uspjesno ste se registrovali.");
                        ap.ime = undefined;
                        ap.prezime = undefined;
                        ap.korisnickoIme = undefined;
                        ap.lozinka = undefined;
                        ap.email = undefined;
                        ap.grad = undefined;
                        ap.telefon = undefined;

                    })
                    .catch(function (error) {
                        alert(error.response.data);
                    })
            }
        }

    }
});

Vue.component('prijava', {
    data: function() {
        return{
            korisnickoIme : undefined,
            lozinka : undefined
        }
    },
    template : `
    <form action="#" method="post" v-on:submit.prevent="prijaviSubmit" accept-charset="UTF-8">
        <div class="form-group">
            <label class="labels" for="inputKorisnickoIme">Korisnicko ime</label>
            <input type="text" class="form-control" id="inputKorisnickoIme" placeholder="Unesite svoje korisnicko ime" v-model="korisnickoIme">
            <div class="invalidacija-feed"> {{korisnickoImeValidaciija}} </div>
        </div>
        <div class="form-group">
            <label class="labels" for="inputLozinka">Password</label>
            <input type="password" id="inputLozinka" class="form-control" placeholder="Unesite svoju lozinku" v-model="lozinka">
            <div class="invalidacija-feed"> {{lozinkaValidacija}} </div>
        </div>
        <button class="btn btn-light" type="submit">Prijava</button>
    </form>				
    `,
    computed : {
        korisnickoImeValidaciija : function() {
            if(this.korisnickoIme === '') {
                return 'Niste uneli korisnicko ime';
            } else {
                return null;
            }
        },
        lozinkaValidacija : function() {
            if(this.lozinka === '') {
                return 'Niste uneli lozinku';
            } else {
                return null;
            }
        }
    },
    methods : {
        prijaviSubmit : function() {
            var korisnik = {
                "korisnickoIme" : this.korisnickoIme,
                "lozinka" : this.lozinka
            };

            var ok = true;

            if(this.korisnickoIme != undefined) {
                this.korisnickoIme.trim();
            } else {
                this.korisnickoIme = '';
            }

            if(this.lozinka != undefined) {
                this.lozinka.trim();
            } else {
                this.lozinka = '';
            }
            
            if(this.korisnickoIme === undefined || this.korisnickoIme === '' || this.lozinka === undefined || this.lozinka === '') {
                ok = false;
            } else {
                ok = true;
            }

            if(ok) {
                axios.post('rest/korisnici/login', korisnik) 
                    .then(function(response) {
                        app.korisnik = response.data;
                        window.location.href = "#/";
                    })
                    .catch(function(error) {
                        alert(error.response.data);
                    })
            }
        }
    }
});