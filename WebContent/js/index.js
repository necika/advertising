const Prijava = { template : '<prijava-registracija></prijava-registracija>'}
const Pocetna = { template : '<pocetna></pocetna>'}
const Korisnici = {template: '<korisnici></korisnici>'}
const Korisnik = {template: '<korisnik></korisnik>'}
const Kategorije = {template: '<kategorije></kategorije>'}
const Nalog = {template: '<nalog></nalog>'}
const Objavi = {template: '<objavi></objavi>'}
const Oglas = {template: '<oglas></oglas>'}
const IzmeniOglas = {template: '<izmeniOglas></izmeniOglas>'}
const Recenzija = {template: '<recenzija></recenzija>'}
const IzmenaRecenzije = { template : '<izmenaRecenzije></izmenaRecenzije>'}
const PosaljiPoruku = { template : '<posaljiPoruku></posaljiPoruku>'}
const Kategorija = { template : '<kategorija></kategorija>'}
const PretragaOglas = { template : '<rezultatOglas></rezultatOglas>'}
const PretragaKorisnik = { template : "<pretragaKorisnik></pretragaKorisnik>" }

const router = new VueRouter({
    mode: 'hash',
    routes: [
      { path: '/', component: Pocetna },
      { path: '/prijava', component: Prijava},
      { path: '/korisnici', component: Korisnici, props : true},
      { path: '/korisnik', component: Korisnik},
      { path: '/kategorije', component: Kategorije},
      { path: '/nalog', component: Nalog},
      { path: '/objavi', component: Objavi},
      { path: '/oglas', component: Oglas},
      { path: '/izmeni', component: IzmeniOglas},
      { path: '/recenzija', component: Recenzija},
      { path: '/izmena/recenzije', component : IzmenaRecenzije },
      { path: '/poruka', component : PosaljiPoruku },
      { path: '/kategorija', component : Kategorija },
      { path: '/pretragaOglas', component : PretragaOglas },
      { path: '/pretragaKorisnik', component : PretragaKorisnik }
    ]
});

var app = new Vue({
    router,
    el: '#app',
    data: {
        text : '',
        kategorijeExpanded : false,
        currentRoute : window.location.pathname,
        korisnik : null,
        kategorije : null,
        gradovi : null,
        pretragaOglas : null,
        pretragaKorisnik : null,
        naziv : '',
        cenaMin : '',
        cenaMax : '',
        ocenaMin : '',
        ocenaMax : '',
        datumMin : '',
        datumMax : '',
        grad : '',
        status : 'Aktivan',
        ime : '',
        gradKorisnik : '',
        pretraga : false
    },
    computed : {
        uloga : function() {
            if(this.korisnik != null) 
            {
                return this.korisnik.uloga;
            } else {
                return null;
            }
        }
    },
    methods: {
        odjaviSe : function() {
            axios.post('rest/korisnici/logout')
                .then(function(response){
                    app.korisnik = null;
                    router.push('/');
                })
                .catch(function(error) {
                    alert(error.response.data);
                })
        },
        dropdownToggle : function() {
            app.kategorijeExpanded = !app.kategorijeExpanded;
        }
    },
    mounted:  function() {
            axios.get('rest/korisnici/ulogovani')
                .then(function (response) {
                    app.korisnik = response.data;
                });
            
            axios.get('rest/kategorije/')
                .then(function(response) {
                    app.kategorije = response.data;
                })
                .catch(function(error){
                    alert(error.response.data);
                })

            axios.get('rest/oglasi/gradovi')
                .then(response => {app.gradovi = response.data;})
    }
});