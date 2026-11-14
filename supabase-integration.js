(function () {
  const fallbackTruckPhoto = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80';
  const fallbackCargoPhoto = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80';

  function db() {
    if (!window.rlhDb) throw new Error('Supabase is not configured yet.');
    return window.rlhDb;
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function setCounts() {
    const truckCount = document.querySelectorAll('#trucks-grid [data-db-card="carrier"]').length;
    const cargoCount = document.querySelectorAll('#cargos-grid [data-db-card="cargo"]').length;
    const deliveryCount = document.querySelectorAll('#delivery-grid [data-db-card="delivery"]').length;
    if (document.getElementById('truck-count-badge')) document.getElementById('truck-count-badge').textContent = String(3 + truckCount);
    if (document.getElementById('cargo-count-badge')) document.getElementById('cargo-count-badge').textContent = String(2 + cargoCount);
    if (document.getElementById('delivery-count-badge')) document.getElementById('delivery-count-badge').textContent = String(deliveryCount);
    if (document.getElementById('stat-trucks')) document.getElementById('stat-trucks').textContent = String(542 + truckCount);
    if (document.getElementById('stat-cargos')) document.getElementById('stat-cargos').textContent = String(189 + cargoCount);
  }

  function addCarrierCard(row, prepend = true) {
    const grid = document.getElementById('trucks-grid');
    if (!grid || document.querySelector(`[data-db-id="${row.id}"]`)) return;
    const photo = row.photo_url || fallbackTruckPhoto;
    const card = document.createElement('div');
    card.dataset.dbCard = 'carrier';
    card.dataset.dbId = row.id;
    card.className = 'bg-brand-bg rounded-2xl overflow-hidden border-2 border-brand hover:border-brand-dark transition shadow-sm flex flex-col justify-between animate-fade-in';
    card.innerHTML = `
      <div><div class="h-44 bg-slate-200 relative overflow-hidden">
        <img src="${esc(photo)}" alt="${esc(row.vehicle_type)}" class="w-full h-full object-cover">
        <span class="absolute top-3 left-3 bg-brand text-white text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full shadow">${row.id ? 'Database' : 'New Carrier'}</span>
      </div><div class="p-5"><div class="flex justify-between items-start mb-3"><div>
        <h4 class="font-extrabold text-slate-900 text-base">${esc(row.vehicle_type)}</h4>
        <p class="text-xs text-slate-500"><i class="fa-solid fa-user text-slate-400 mr-1"></i> ${esc(row.name)}</p>
      </div><span class="font-mono text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 uppercase">${esc(row.plate_number)}</span></div>
      <div class="space-y-1.5 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-150">
        <div class="flex justify-between"><span>Uburemere Icapa:</span><span class="font-bold text-slate-900">${esc(row.capacity_tons)} Tons</span></div>
        <div class="flex justify-between"><span>Aho Iherereye:</span><span class="font-bold text-brand-blue">${esc(row.location)}</span></div>
      </div></div></div>
      <div class="p-5 pt-0"><button class="db-carrier-contact w-full bg-brand hover:bg-brand-dark text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5"><i class="fa-solid fa-phone"></i><span>Vugana n'Umutware</span></button></div>`;
    card.querySelector('.db-carrier-contact').addEventListener('click', () => showCarrierDetails(row.name, row.phone, row.vehicle_type, row.plate_number, row.location, photo));
    prepend ? grid.prepend(card) : grid.appendChild(card);
  }

  function addCargoCard(row, prepend = true) {
    const grid = document.getElementById('cargos-grid');
    if (!grid || document.querySelector(`[data-db-id="${row.id}"]`)) return;
    const photo = row.photo_url || fallbackCargoPhoto;
    const card = document.createElement('div');
    card.dataset.dbCard = 'cargo';
    card.dataset.dbId = row.id;
    card.className = 'bg-brand-bg rounded-2xl overflow-hidden border-2 border-brand-slate transition shadow-sm flex flex-col justify-between animate-fade-in';
    const tons = (Number(row.weight_kg) / 1000).toFixed(1) + ' Tons';
    card.innerHTML = `
      <div><div class="h-44 bg-slate-200 relative overflow-hidden"><img src="${esc(photo)}" alt="${esc(row.cargo_type)}" class="w-full h-full object-cover"><span class="absolute top-3 left-3 bg-amber-500 text-white text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full shadow">Umzigo Mushya</span></div>
      <div class="p-5"><div class="flex justify-between items-start mb-3"><div><h4 class="font-extrabold text-slate-900 text-base">${esc(row.cargo_type)}</h4><p class="text-xs text-slate-500"><i class="fa-solid fa-building text-slate-400 mr-1"></i> ${esc(row.shipper_name || 'Shipper')}</p></div><span class="text-xs font-bold text-brand bg-white px-2.5 py-1 rounded-lg border border-slate-200">${esc(tons)}</span></div>
      <div class="space-y-1.5 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-150"><div class="flex justify-between"><span>Inzira:</span><span class="font-bold text-slate-900">${esc(row.origin)} ➔ ${esc(row.destination)}</span></div><div class="flex justify-between"><span>TIN y'Ubucuruzi:</span><span class="font-mono font-bold text-slate-700">${esc(row.shipper_tin || 'N/A')}</span></div></div></div></div>
      <div class="p-5 pt-0"><button class="db-cargo-contact w-full bg-brand-slate hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5"><i class="fa-solid fa-hand-holding-dollar"></i><span>Tanga Igiciro cyawe (Bid)</span></button></div>`;
    card.querySelector('.db-cargo-contact').addEventListener('click', () => showCargoDetails(row.cargo_type, row.shipper_name || 'Shipper', row.shipper_phone || '', row.shipper_tin || '', tons, `${row.origin} ➔ ${row.destination}`, photo));
    prepend ? grid.prepend(card) : grid.appendChild(card);
  }

  function addDeliveryCard(row) {
    const grid = document.getElementById('delivery-grid');
    if (!grid || document.querySelector(`[data-db-id="${row.id}"]`)) return;
    const card = document.createElement('div');
    card.dataset.dbCard = 'delivery'; card.dataset.dbId = row.id;
    card.className = 'bg-brand-bg rounded-2xl border-2 border-brand transition shadow-sm p-5 animate-fade-in';
    card.innerHTML = `<div class="flex justify-between items-start gap-3 mb-4"><div><span class="inline-block bg-brand text-white text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full">Request Nshya</span><h4 class="font-extrabold text-slate-900 text-base mt-2">${esc(row.cargo)}</h4><p class="text-xs text-slate-500"><i class="fa-solid fa-user mr-1"></i>${esc(row.name)}</p></div><span class="text-xs font-bold text-brand bg-white px-2.5 py-1 rounded-lg border border-slate-200">${Number(row.weight_kg).toLocaleString()} kg</span></div><div class="space-y-1.5 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200"><div class="flex justify-between gap-3"><span>Inzira:</span><span class="font-bold text-slate-900">${esc(row.origin)} ➔ ${esc(row.destination)}</span></div><div class="flex justify-between gap-3"><span>Telefone:</span><span class="font-bold text-slate-900">${esc(row.phone)}</span></div></div><a href="tel:${esc(String(row.phone).replace(/\s+/g,''))}" class="mt-4 w-full bg-brand hover:bg-brand-dark text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"><i class="fa-solid fa-phone"></i><span>Vugana n'Usabye Transport</span></a>`;
    grid.appendChild(card);
  }

  async function loadMarketplace() {
    if (!window.rlhSupabaseReady) return;
    try {
      const client = db();
      const { data: carriers, error: carrierError } = await client.from('carriers').select('*').eq('status', 'active').order('created_at', { ascending: false });
      if (carrierError) throw carrierError;
      carriers.forEach(addCarrierCard);
      const { data: cargos, error: cargoError } = await client.from('cargos').select('*, shippers(name, phone, tin)').eq('status', 'available').order('created_at', { ascending: false });
      if (cargoError) throw cargoError;
      cargos.forEach(c => addCargoCard({ ...c, shipper_name: c.shippers?.name, shipper_phone: c.shippers?.phone, shipper_tin: c.shippers?.tin }));
      const { data: requests, error: requestError } = await client.from('delivery_requests').select('*').eq('status', 'open').order('created_at', { ascending: false });
      if (requestError) throw requestError;
      requests.forEach(addDeliveryCard);
      setCounts();
    } catch (error) {
      console.error(error);
      showToast('Database ntiyashoboye kuboneka. Reba Supabase configuration.', 'info');
    }
  }

  window.handleCarrierRegister = async function (e) {
    e.preventDefault();
    if (!window.rlhSupabaseReady) return showToast('Banza ushyire Supabase URL na anon key muri supabase-config.js.', 'info');
    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const vehicle_type = document.getElementById('c-vtype').value.trim();
    const plate_number = document.getElementById('c-plate').value.trim().toUpperCase();
    const capacity_tons = Number(document.getElementById('c-capacity').value);
    const location = document.getElementById('c-location').value.trim();
    const photo_url = document.getElementById('c-photo').value.trim() || fallbackTruckPhoto;
    try {
      const { data, error } = await db().from('carriers').insert({ name, phone, vehicle_type, plate_number, capacity_tons, location, photo_url, status: 'active' }).select().single();
      if (error) throw error;
      addCarrierCard(data);
      setCounts();
      closeRegisterModal();
      switchMarketplaceTab('trucks');
      e.target.reset();
      showToast(`Murakoze ${name}! Imodoka yawe (${plate_number}) yabitswe muri database.`);
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Kwiyandikisha byanze.', 'info');
    }
  };

  window.handleShipperRegister = async function (e) {
    e.preventDefault();
    if (!window.rlhSupabaseReady) return showToast('Banza ushyire Supabase URL na anon key muri supabase-config.js.', 'info');
    const name = document.getElementById('s-name').value.trim();
    const phone = document.getElementById('s-phone').value.trim();
    const tin = document.getElementById('s-tin').value.trim();
    const cargo_type = document.getElementById('s-cargo').value.trim();
    const weight_kg = Number(document.getElementById('s-weight').value);
    const origin = document.getElementById('s-from').value.trim();
    const destination = document.getElementById('s-to').value.trim();
    const photo_url = document.getElementById('s-photo').value.trim() || fallbackCargoPhoto;
    try {
      const client = db();
      const { data: shipper, error: shipperError } = await client.from('shippers').insert({ name, phone, tin }).select().single();
      if (shipperError) throw shipperError;
      const tracking_code = 'RLH-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      const { data: cargo, error: cargoError } = await client.from('cargos').insert({ shipper_id: shipper.id, cargo_type, weight_kg, origin, destination, photo_url, tracking_code, status: 'available' }).select().single();
      if (cargoError) throw cargoError;
      addCargoCard({ ...cargo, shipper_name: name, shipper_phone: phone, shipper_tin: tin });
      setCounts();
      closeRegisterModal();
      switchMarketplaceTab('cargos');
      e.target.reset();
      showToast(`Umzigo wa ${name} wabitswe neza. Tracking code: ${tracking_code}`);
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Kwiyandikisha kwanze.', 'info');
    }
  };

  window.handleDeliveryRequest = async function (e) {
    e.preventDefault();
    if (!window.rlhSupabaseReady) return showToast('Banza ushyire Supabase URL na anon key muri supabase-config.js.', 'info');
    const payload = {
      name: document.getElementById('d-name').value.trim(),
      phone: document.getElementById('d-phone').value.trim(),
      cargo: document.getElementById('d-cargo').value.trim(),
      weight_kg: Number(document.getElementById('d-weight').value),
      origin: document.getElementById('d-from').value.trim(),
      destination: document.getElementById('d-to').value.trim(),
      status: 'open'
    };
    try {
      const { data, error } = await db().from('delivery_requests').insert(payload).select().single();
      if (error) throw error;
      addDeliveryCard(data); setCounts(); e.target.reset();
      showToast(`Request ya ${payload.name} yabitswe muri database.`);
    } catch (error) { console.error(error); showToast(error.message || 'Request ntiyabitswe.', 'info'); }
  };

  window.submitCustoms = async function () {
    if (!window.rlhSupabaseReady) return showToast('Banza ushyire Supabase URL na anon key muri supabase-config.js.', 'info');
    const tin = document.getElementById('tin').value.trim();
    const company = document.getElementById('company').value.trim();
    const commodity = document.getElementById('commodity').value.trim();
    const cargo_value_rwf = Number(document.getElementById('cargo-val').value) || 0;
    const border = document.getElementById('border').value;
    const estimated_duty_rwf = Math.round(cargo_value_rwf * 0.18);
    try {
      const { error } = await db().from('customs_declarations').insert({ tin, company, commodity, cargo_value_rwf, border, estimated_duty_rwf, status: 'draft' });
      if (error) throw error;
      showToast('Declarasiyo yabitswe muri database kandi yiteguye koherezwa.');
      document.getElementById('customs-output').classList.add('hidden');
      document.getElementById('customs-form').reset();
    } catch (error) { console.error(error); showToast(error.message || 'Declarasiyo ntiyabitswe.', 'info'); }
  };

  document.addEventListener('DOMContentLoaded', loadMarketplace);
})();
