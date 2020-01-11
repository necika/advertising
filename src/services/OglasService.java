package services;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Kategorija;
import beans.Korisnik;
import beans.Kupac;
import beans.Oglas;
import beans.Poruka;
import beans.Prodavac;
import beans.Recenzija;
import dao.KategorijaDAO;
import dao.KorisnikDAO;
import dao.OglasDAO;

@Path("/oglasi")
public class OglasService {
	@Context
	ServletContext ctx;

	@Context
	HttpServletRequest request;

	public OglasService() {

	}

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("korisnici") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("korisnici", new KorisnikDAO(contextPath));
		}
		if (ctx.getAttribute("kategorije") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("kategorije", new KategorijaDAO(contextPath));
		}
		if (ctx.getAttribute("oglasi") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("oglasi", new OglasDAO(contextPath));
		}
	}

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOglasi() {
		OglasDAO oglas = (OglasDAO) ctx.getAttribute("oglasi");
		return Response.ok(oglas.getOglasi()).build();
	}

	@GET
	@Path("/najpopularniji")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getNajpopularniji() {
		OglasDAO oglas = (OglasDAO) ctx.getAttribute("oglasi");
		
		//Collection<Oglas> ogl = oglas.getOglasi();
		
		return Response.ok(oglas.getNajpopularnijeOglase()).build();
	}

	@GET
	@Path("/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOglas(@PathParam("naziv") String naziv) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		OglasDAO oglas = (OglasDAO) ctx.getAttribute("oglasi");
		return Response.ok(oglas.getOglas(naziv)).build();
	}

	@DELETE
	@Path("/obrisi/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response obrisiOglas(@PathParam("naziv") String naziv) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null || ulogovan.getUloga().equals("Kupac")) {
			return Response.status(400).entity("Kupac nema dozvolu za brisanje oglasa.").build();
		}

		OglasDAO oglas = (OglasDAO) ctx.getAttribute("oglasi");
		Oglas o = oglas.getOglas(naziv);
		oglas.ukloniOglas(naziv);
		KategorijaDAO kategorija = (KategorijaDAO) ctx.getAttribute("kategorije");
		kategorija.ukloniKategoriju(naziv);

		KorisnikDAO korisnik = (KorisnikDAO) ctx.getAttribute("korisnici");
		Prodavac p = (Prodavac) korisnik.getKorisnik(o.getKorisnickoIme());
		p.getObjavljeniOglasi().remove(naziv);

		for (String korIme : o.getKorisnici()) {
			Kupac k = (Kupac) korisnik.getKorisnik(korIme);
			k.getOmiljeniOglasi().remove(naziv);
		}

		if (ulogovan.getUloga().equals("Administrator")) {
			if (o.getAktivan() == 0) {
				String sadrzaj = "Administrator je uklonio vas oglas " + naziv + " .";
				DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
				Date date = new Date();
				String datum = df.format(date);
				Poruka poruka = new Poruka(naziv, "Administrator", "Brisanje oglasa", sadrzaj, datum);
				poruka.setId(p.getPoruke().size());
				p.getPoruke().add(poruka);
			}
		} else if (ulogovan.getUloga().equals("Prodavac")) {
			String sadrzaj = "Prodavac " + ulogovan.getKorisnickoIme() + " je obrisao oglas " + naziv + " .";
			DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			Date date = new Date();
			String datum = df.format(date);

			for (Korisnik admin : korisnik.getAdmin()) {
				Poruka poruka = new Poruka(naziv, ulogovan.getKorisnickoIme(), "Brisanje oglasa", sadrzaj, datum);
				poruka.setId(admin.getPoruke().size());
				admin.getPoruke().add(poruka);
			}
		}

		String contextPath = ctx.getRealPath("");
		korisnik.sacuvajKorisnike(contextPath);
		oglas.sacuvajOglase(contextPath);
		kategorija.sacuvajKategorije(contextPath);

		return Response.status(200).build();
	}

	@PUT
	@Path("/izmeni/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response izmeniOglas(@PathParam("naziv") String naziv, Oglas oglas) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		if (oglas.getNaziv().equals("") || oglas.getOpis().equals("") || oglas.getDatumIsticanja().equals("")
				|| oglas.getGrad().equals("") || oglas.getNazivSlike().equals("") || oglas.getKategorija().equals("")) {
			return Response.status(400).entity("Niste popunili obavezna polja.").build();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");
		if (ulogovan == null || ulogovan.getUloga().equals("Kupac")) {
			return Response.status(400).entity("Kupac nema dozvolu za izmenu oglasa.").build();
		}

		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		// Oglas stari = od.getOglas(naziv);
		if (od.putOglas(naziv, oglas) == null) {
			return Response.status(400).entity("Ne postoji oglas sa datim nazivom.").build();
		}

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		if (ulogovan.getUloga().equals("Administrator")) {
			String sadrzaj = "Administrator je izmenio vas oglas " + naziv + " .";
			DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			Date date = new Date();
			String datum = df.format(date);
			Poruka poruka = new Poruka(naziv, "Administrator", "Izmena oglasa", sadrzaj, datum);
			Prodavac prodavac = (Prodavac) kd.getKorisnik(oglas.getKorisnickoIme());
			poruka.setId(prodavac.getPoruke().size());
			prodavac.getPoruke().add(poruka);

			if (oglas.getAktivan() != 0) {
				sadrzaj = "Administrator je izmenio oglas " + naziv + " .";
				poruka = new Poruka(naziv, "Administrator", "Izmena oglasa", sadrzaj, datum);
				Kupac kupac = (Kupac) kd.getKorisnik(oglas.getPorucilac());
				poruka.setId(kupac.getPoruke().size());
				kupac.getPoruke().add(poruka);
			}
		}

		String contextPath = ctx.getRealPath("");
		kd.sacuvajKorisnike(contextPath);
		od.sacuvajOglase(contextPath);

		return Response.status(200).build();
	}

	@PUT
	@Path("/omiljeni/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response omiljeniOglas(@PathParam("naziv") String naziv) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");
		if (ulogovan == null || !ulogovan.getUloga().equals("Kupac")) {
			return Response.status(400).entity("Samo kupac moze da obelezi omiljene oglase.").build();
		}

		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		String contextPath = ctx.getRealPath("");
		Oglas oglas = od.getOglas(naziv);
		Kupac kupac = (Kupac) ulogovan;

		if (kupac.addOmiljeni(naziv)) {
			oglas.getKorisnici().add(kupac.getKorisnickoIme());
			oglas.setBrojOmiljenih(oglas.getBrojOmiljenih() + 1);
			od.sacuvajOglase(contextPath);
			kd.sacuvajKorisnike(contextPath);
			return Response.status(200).entity(kupac.getKorisnickoIme()).build();
		}

		return Response.status(400).entity("Vec ste oznacili ovaj oglas kao omiljeni.").build();
	}

	@PUT
	@Path("poruci/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response poruciOglas(@PathParam("naziv") String naziv) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");
		if (ulogovan == null || !ulogovan.getUloga().equals("Kupac")) {
			return Response.status(400).entity("Samo kupac moze da poruci proizvod.").build();
		}

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");

		if (od.poruci(ulogovan.getKorisnickoIme(), naziv)) {
			kd.poruci(ulogovan.getKorisnickoIme(), naziv);
			String contextPath = ctx.getRealPath("");
			od.sacuvajOglase(contextPath);
			kd.sacuvajKorisnike(contextPath);

			return Response.status(200).entity(ulogovan.getKorisnickoIme()).build();
		} else {
			return Response.status(400).entity("Odabrani proizvod trenutno nije moguce poruciti.").build();
		}

	}

	@PUT
	@Path("dostavljen/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response dostaviOglas(@PathParam("naziv") String naziv) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");
		if (ulogovan == null || !ulogovan.getUloga().equals("Kupac")) {
			return Response.status(400).entity("Samo kupcu oglas moze biti oznacen kao dostavljen.").build();
		}

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		if (od.dostavi(ulogovan.getKorisnickoIme(), naziv)) {
			kd.dostavi(ulogovan.getKorisnickoIme(), od.getOglas(naziv));

			String sadrzaj = "Vas oglas " + naziv + " je uspesno dostavljen.";
			DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			Date date = new Date();
			String datum = df.format(date);
			Poruka poruka = new Poruka(naziv, "Administrator", "Dostava", sadrzaj, datum);
			Prodavac prodavac = (Prodavac) kd.getKorisnik(od.getOglas(naziv).getKorisnickoIme());
			poruka.setId(prodavac.getPoruke().size());
			prodavac.getPoruke().add(poruka);
			prodavac.getIsporuceniProizvodi().add(naziv);

			String contextPath = ctx.getRealPath("");
			od.sacuvajOglase(contextPath);
			kd.sacuvajKorisnike(contextPath);

			return Response.status(200).entity(ulogovan.getKorisnickoIme()).build();
		} else {
			return Response.status(400)
					.entity("Samo korisnik koje je porucio prozivod moze oznaciti da mu je dostavljen proizvod.")
					.build();
		}

	}

	@POST
	@Path("/dodaj")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response dodajOglas(Oglas oglas) {
		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");
		if (ulogovan == null || !ulogovan.getUloga().equals("Prodavac")) {
			return Response.status(400).entity("Samo prodavci mogu da postavljaju oglase.").build();
		}
		if (oglas.getNaziv().equals("") || oglas.getOpis().equals("") || oglas.getDatumIsticanja().equals("")
				|| oglas.getGrad().equals("") || oglas.getNazivSlike().equals("") || oglas.getKategorija().equals("")) {
			return Response.status(400).entity("Niste uneli sva obavezna polja.").build();
		}

		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		KategorijaDAO katd = (KategorijaDAO) ctx.getAttribute("kategorije");
		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		String contextPath = ctx.getRealPath("");
		Prodavac prodavac = (Prodavac) kd.getKorisnik(ulogovan.getKorisnickoIme());

		oglas.setKorisnickoIme(prodavac.getKorisnickoIme());
		if (od.dodajOglas(oglas) == null) {
			katd.dodajOglas(oglas.getKategorija(), oglas.getNaziv());
			prodavac.getObjavljeniOglasi().add(oglas.getNaziv());
			kd.sacuvajKorisnike(contextPath);
			od.sacuvajOglase(contextPath);
			katd.sacuvajKategorije(contextPath);

			return Response.status(200).build();
		} else {
			return Response.status(400).entity("Oglas sa nazivom koji ste uneli vec postoji.").build();
		}
	}

	@GET
	@Path("/recenzija/{naziv}/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRecenzija(@PathParam("naziv") String naziv, @PathParam("id") int id) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		String[] parts = naziv.split("&");
		Oglas o = od.getOglas(parts[1]);

		if (parts[0].equals("0")) {
			return Response.ok(o.getRecenzije().get(id)).build();
		} else {
			KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
			Prodavac prodavac = (Prodavac) kd.getKorisnik(o.getKorisnickoIme());

			return Response.ok(prodavac.getRecenzije().get(id)).build();
		}
	}
	
	@POST
	@Path("/recenzija/{prijava}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response ostaviRecenziju(@PathParam("prijava") boolean prijava, Recenzija recenzija) {
		Korisnik logged = (Korisnik) request.getSession().getAttribute("ulogovani");
		if(logged == null || !logged.getUloga().equals("Kupac")) {
			return Response.status(400).entity("Samo kupci imaju pravo da ostavljaju recenziju").build();
		}
		if(recenzija.getNaslov().equals("") || recenzija.getSadrzaj().equals("")) {
			return Response.status(400).entity("Niste popounili sva obavezna polja.").build();
		}
		if(recenzija.isOglasTacan() && recenzija.isIspostovanDogovor() && prijava) {
			return Response.status(400).entity("Ne mozete prijaviti prodavca ukoliko je sve bilo uredu.").build();
		}
		
		OglasDAO oglasDao = (OglasDAO) ctx.getAttribute("oglasi");
		KorisnikDAO korisnikDao = (KorisnikDAO) ctx.getAttribute("korisnici");
		Oglas oglas = oglasDao.getOglas(recenzija.getOglas());
		String entitiy;
		Prodavac prodavac = (Prodavac) korisnikDao.getKorisnik(oglas.getKorisnickoIme());
		if(recenzija.getNa().equals("Oglas")) {
			recenzija.setId(oglas.getRecenzije().size());
			oglas.getRecenzije().add(recenzija);
			entitiy = oglas.getNaziv();
		}
		else {
			recenzija.setId(prodavac.getRecenzije().size());
			prodavac.getRecenzije().add(recenzija);
			entitiy = prodavac.getKorisnickoIme();
		}
		if(prijava) {
			prodavac.setPrijave(prodavac.getPrijave() + 1);
			
			String sadrzaj = "Prijavljeni ste od strane kupca zbog neispravnosti proizvoda. Ukoliko budete prijavljeni vise od 3 puta, bice vam onemoguceno postavljanje oglasa.";
			DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			Date date = new Date();
			String datum = dateFormat.format(date);
			Poruka poruka = new Poruka(oglas.getNaziv(), "Administrator", "Upozorenje", sadrzaj, datum);
			poruka.setId(prodavac.getPoruke().size());
			prodavac.getPoruke().add(poruka);
			
			Kupac kupac = (Kupac) korisnikDao.getKorisnik(recenzija.getRecenzent());
			kupac.getPrijave().add(oglas.getNaziv());
		}
		if(oglas.getPorucilac().equals(recenzija.getRecenzent())) {
			oglas.setAktivan(0);
			oglas.setPorucilac("");
		}
		
		String sadrzaj = "Kupac " + recenzija.getRecenzent() + " je ostavio recenziju na Vas oglas " + oglas.getNaziv();
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date();
		String datum = dateFormat.format(date);
		Poruka poruka = new Poruka(oglas.getNaziv(), "Administrator", "Recenzija", sadrzaj, datum);
		poruka.setId(prodavac.getPoruke().size());
		prodavac.getPoruke().add(poruka);
		
		String contextPath = ctx.getRealPath("");
		oglasDao.sacuvajOglase(contextPath);
		korisnikDao.sacuvajKorisnike(contextPath);
		
		return Response.status(200).entity(entitiy).build();
	}

	@POST
	@Path("/recenzija/izmena/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response izmeniRecenziju(@PathParam("id") int id, Recenzija recenzija) {
		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null || !ulogovan.getKorisnickoIme().equals(recenzija.getRecenzent())) {
			return Response.status(400).entity("Recenziju moze da izmeni samo korisnik koji ju je postavio.").build();
		}

		if (recenzija.getNaslov().equals("") || recenzija.getSadrzaj().equals("")) {
			return Response.status(400).entity("Nisu uneta sva obavezna polja.").build();
		}

		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		Oglas o = od.getOglas(recenzija.getOglas());
		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		Prodavac prodavac = (Prodavac) kd.getKorisnik(o.getKorisnickoIme());
		String contextPath = ctx.getRealPath("");

		String sadrzaj = "Kupac " + recenzija.getRecenzent() + " je izmenio recenziju za oglas " + o.getNaziv() + ".";
		DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date();
		String datum = df.format(date);
		Poruka poruka = new Poruka(o.getNaziv(), "Administrator", "Izmena recenzije", sadrzaj, datum);
		poruka.setId(prodavac.getPoruke().size());
		prodavac.getPoruke().add(poruka);

		if (recenzija.getNa().equals("Oglas")) {
			o.getRecenzije().set(id, recenzija);
			od.sacuvajOglase(contextPath);
			kd.sacuvajKorisnike(contextPath);

			return Response.ok(o.getNaziv()).build();
		} else {
			prodavac.getRecenzije().set(id, recenzija);
			od.sacuvajOglase(contextPath);
			kd.sacuvajKorisnike(contextPath);

			return Response.ok(prodavac.getKorisnickoIme()).build();
		}
	}

	@PUT
	@Path("/lajk/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response lajkujOglas(@PathParam("naziv") String naziv) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null || !ulogovan.getUloga().equals("Kupac")) {
			return Response.status(400).entity("Samo kupci mogu da lajkuju proizvode.").build();
		}

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		Oglas o = od.getOglas(naziv);

		if (ulogovan != null && ulogovan.getUloga().equals("Kupac")) {
			Kupac kupac = (Kupac) kd.getKorisnik(ulogovan.getKorisnickoIme());

			if (!kupac.getOcene().contains(naziv)) {
				o.setBrojLajkova(o.getBrojLajkova() + 1);
				kupac.getOcene().add(naziv);

				return Response.status(200).entity(o).build();
			} else {
				return Response.status(400).entity("Vec ste ocenili oglas.").build();
			}
		} else {
			return Response.status(400).entity("Potrebno je da se prijavite da biste ocenili oglas.").build();
		}

	}

	@PUT
	@Path("/dislajk/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response dislajkujOglas(@PathParam("naziv") String naziv) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null || !ulogovan.getUloga().equals("Kupac")) {
			return Response.status(400).entity("Samo kupci mogu da dislajkuju proizvode.").build();
		}

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		Oglas o = od.getOglas(naziv);
		Kupac kupac = (Kupac) kd.getKorisnik(ulogovan.getKorisnickoIme());

		if (!kupac.getOcene().contains(naziv)) {
			o.setBrojDislajkova(o.getBrojDislajkova() + 1);
			kupac.getOcene().add(naziv);

			return Response.status(200).entity(o).build();
		} else {
			return Response.status(400).entity("Vec ste ocenili oglas.").build();
		}
	}

	@DELETE
	@Path("/izbrisi/recenzija")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response obrisiRecenziju(Recenzija recenzija) {
		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null || !ulogovan.getKorisnickoIme().equals(recenzija.getRecenzent())) {
			return Response.status(400).entity("Recenziju moze da obrise samo korisnik koji ju je postavio.").build();
		}

		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		Oglas o = od.getOglas(recenzija.getOglas());
		String contextPath = ctx.getRealPath("");

		if (recenzija.getNa().equals("Oglas")) {
			o.getRecenzije().get(recenzija.getId()).setObrisana(true);
			od.sacuvajOglase(contextPath);

			return Response.status(200).build();
		} else {
			KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
			Prodavac prodavac = (Prodavac) kd.getKorisnik(o.getKorisnickoIme());
			prodavac.getRecenzije().get(recenzija.getId()).setObrisana(true);
			kd.sacuvajKorisnike(contextPath);

			return Response.status(200).build();
		}
	}

	@GET
	@Path("/poruke/{korisnickoIme}")
	public Response getPoruke(@PathParam("korisnickoIme") String korisnickoIme) {
		try {
			korisnickoIme = java.net.URLDecoder.decode(korisnickoIme, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		Korisnik korisnik = (Korisnik) kd.getKorisnik(korisnickoIme);
		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null) {
			return Response.status(400)
					.entity("Potrebno je da se ulogujete da biste mogli da saljete i pregledate poruke.").build();
		}

		if (korisnik.getUloga().equals("Administrator")) {
			Prodavac prodavac = (Prodavac) ulogovan;

			return Response.ok(prodavac.getObjavljeniOglasi()).build();
		} else if (korisnik.getUloga().equals("Prodavac")) {
			Prodavac prodavac = (Prodavac) korisnik;

			return Response.ok(prodavac.getObjavljeniOglasi()).build();
		} else {
			Kupac kupac = (Kupac) korisnik;

			return Response.ok(kupac.getPoruceniProizvodi()).build();
		}

	}

	@POST
	@Path("filter/{status}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getStatus(@PathParam("status") String status) {
		Prodavac ulogovan = (Prodavac) request.getSession().getAttribute("ulogovani");
		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");

		Collection<Oglas> ret = new ArrayList<Oglas>();

		for (String naziv : ulogovan.getObjavljeniOglasi()) {
			Oglas o = od.getOglas(naziv);

			if (status.equals("Aktivni")) {
				if (o.getAktivan() == 0) {
					ret.add(o);
				}
			} else if (status.equals("Realizacija")) {
				if (o.getAktivan() == 1) {
					ret.add(o);
				}
			} else {
				if (o.getAktivan() == 2) {
					ret.add(o);
				}
			}
		}

		return Response.ok(ret).build();
	}

	@GET
	@Path("/kategorija/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getKategorije(@PathParam("naziv") String naziv) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		KategorijaDAO katd = (KategorijaDAO) ctx.getAttribute("kategorije");
		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		Kategorija kategorija = katd.getKategorija(naziv);

		Collection<Oglas> ret = new ArrayList<Oglas>();
		for (String nazivOglasa : kategorija.getOglasi()) {
			Oglas o = od.getOglas(nazivOglasa);
			ret.add(o);
		}

		return Response.ok(ret).build();
	}

	@POST
	@Path("/pretraga")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response pretraziOglase(Map<String, String> params) {
		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		String naziv = (String) params.get("naziv");
		String cenaMin = (String) params.get("cenaMin");
		String cenaMax = (String) params.get("cenaMax");
		String ocenaMin = (String) params.get("ocenaMin");
		String ocenaMax = (String) params.get("ocenaMax");
		String datumMin = (String) params.get("datumMin");
		String datumMax = (String) params.get("datumMax");
		String grad = (String) params.get("grad");
		String status = (String) params.get("status");
		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		return Response.ok(
				od.pretrazi(naziv, cenaMin, cenaMax, ocenaMin, ocenaMax, datumMin, datumMax, grad, status, ulogovan))
				.build();
	}

	@GET
	@Path("/gradovi")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getGradovi() {
		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");

		return Response.ok(od.getGradovi()).build();
	}
}
