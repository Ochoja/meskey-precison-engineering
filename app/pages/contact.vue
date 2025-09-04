<template>
  <main
    class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 layout-pad mt-12 mb-24">
    <div>
      <h1 class="text-5xl">Contact Us</h1>
      <p class="font-light mb-12">
        Get In touch with us for enquiries, support or any questions
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h6>Support</h6>
          <a>support@meskyprecisioneng.com</a>
        </div>
        <div>
          <h6>General Enquiries</h6>
          <a>info@meskyprecisioneng.com</a>
        </div>
        <div>
          <h6>Lagos Office</h6>
          <p>Zone C, Block 8 shop 23 ASPAMDA Plaza Trade fair complex Lagos.</p>
        </div>
        <div>
          <h6>Kaduna Office</h6>
          <p>
            No 4 School Road, Off Makama Plaza, Opposite Kaduna Refinery
            Complex, Kaduna
          </p>
        </div>
        <div>
          <h6>Abuja Office</h6>
          <p>
            Dawaki Abuja Behind Sunset Energy Fueling Station Murtala Mohammed
            Way (Kubwa Express)
          </p>
        </div>
        <div>
          <h6>Phone</h6>
          <div>
            <a href="">+234 (0) 803 282 7341</a>
            <a href="">+234 (0) 703 039 9465</a>
          </div>
        </div>
      </div>
    </div>
    <form
      class="bg-[#fafafa] border border-primary-20 px-8 py-6 rounded-2xl shadow-[2px_2px_50px_20px_rgba(0,0,0,0.04)]">
      <h4 class="text-2xl mb-8">Send a Message</h4>
      <div>
        <label for="full_name">Full Name</label>
        <input type="text" id="full_name" />

        <label for="full_name">Email Address</label>
        <input type="text" id="full_name" />

        <label for="full_name">Phone Number</label>
        <input type="tel" id="full_name" />

        <label for="full_name">Full Name</label>
        <select>
          <option value="">Purpose of Enquiry</option>
        </select>

        <label for="message">Message</label>
        <textarea
          name="message"
          id="message"
          placeholder="Type a Message"
          rows="8"></textarea>
      </div>

      <button
        class="bg-primary text-white w-full font-medium text-lg py-4 rounded-xl">
        Send a Message
      </button>
    </form>
  </main>
</template>

<style scoped>
h6 {
  font-weight: 500;
  font-size: 1.2rem;
}

a,
p {
  display: block;
  font-weight: 300;
}

label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

input,
textarea,
select {
  margin-bottom: 1rem;
  background: #fff;
  padding: 12px 8px;
  border: 1px solid #bec0c0;
  border-radius: 10px;
  width: 100%;
  font-size: 0.8rem;
}
</style>
